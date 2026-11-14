import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/verify.server";
import { assertSameSiteRequest } from "@/lib/auth/isolation.server";
import { extractFindings } from "@/lib/findings";
import { detectLab, mentionsExternalHost } from "@/lib/labs";
import { detectSkill } from "@/lib/kali-skills";
import { getModel, type OperatorMode } from "@/lib/models";
import { nodeAnalyst } from "@/lib/node-analyst";
import { systemPromptFor } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/types";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => handleChat(request),
    },
  },
});

type Body = {
  engagementId: string;
  content: string;
  mode: OperatorMode;
  modelId: string;
};

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function handleChat(request: Request) {
  try {
    assertSameSiteRequest();
  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const user = await getSessionUser(bearer);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = (body.content ?? "").trim();
  if (!content) return Response.json({ error: "Empty prompt" }, { status: 400 });
  if (content.length > 8000) return Response.json({ error: "Prompt too long" }, { status: 400 });
  if (!body.engagementId) return Response.json({ error: "Missing engagement" }, { status: 400 });

  const sql = await getSql();
  const owned = await sql<{ id: string; title: string }>`
    select id, title from engagements
    where id = ${body.engagementId} and user_id = ${user.id}
    limit 1
  `;
  if (!owned[0]) return Response.json({ error: "Not found" }, { status: 404 });

  const apiKey = process.env.XAI_API_KEY;

  const userMsgId = crypto.randomUUID();
  await sql`
    insert into messages (id, engagement_id, user_id, role, content, kind)
    values (${userMsgId}, ${body.engagementId}, ${user.id}, ${"user"}, ${content}, ${"text"})
  `;

  const skill = detectSkill(content);
  const lab = detectLab(content) ?? (skill?.labId ? detectLab(skill.labId) : null);
  let recon: string | null = null;
  let reconId: string | null = null;
  const wantRecon = Boolean(lab) && (body.mode === "hunt" || Boolean(skill));
  if (wantRecon && lab) {
    recon = lab.recon;
    reconId = crypto.randomUUID();
    await sql`
      insert into messages (id, engagement_id, user_id, role, content, kind)
      values (${reconId}, ${body.engagementId}, ${user.id}, ${"assistant"}, ${recon}, ${"recon"})
    `;
  }

  const history = await sql<ChatMessage>`
    select id, engagement_id, user_id, role, content, kind, created_at
    from messages
    where engagement_id = ${body.engagementId} and user_id = ${user.id}
    order by created_at desc
    limit 16
  `;
  history.reverse();

  const model = getModel(body.modelId);
  const mode = body.mode ?? "chat";
  let extra = "";
  if (mentionsExternalHost(content) && !lab) {
    extra =
      "\nThe latest user message mentions a host that is not a known lab. Do not produce operational scan or exploit steps. Offer a conceptual answer and a lab alternative.";
  }

  const llmMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPromptFor(mode) + extra },
  ];
  for (const m of history) {
    if (m.kind === "system") continue;
    if (m.kind === "recon") {
      llmMessages.push({
        role: "user",
        content: `Isolated lab recon dump (not live internet):\n\`\`\`\n${m.content}\n\`\`\``,
      });
      continue;
    }
    llmMessages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sse(event, data)));
      };
      try {
        if (recon && reconId) {
          send("recon", { id: reconId, content: recon, labId: lab?.id ?? null });
        }

        const finish = async (full: string) => {
          const { cleaned, findings } = extractFindings(full);
          const assistantId = crypto.randomUUID();
          const stored = cleaned || full.trim() || "No response from the operator.";
          await sql`
            insert into messages (id, engagement_id, user_id, role, content, kind)
            values (${assistantId}, ${body.engagementId}, ${user.id}, ${"assistant"}, ${stored}, ${"text"})
          `;
          const savedFindings = [];
          for (const f of findings.slice(0, 8)) {
            const fid = crypto.randomUUID();
            await sql`
              insert into findings (id, engagement_id, user_id, severity, title, evidence, cwe)
              values (${fid}, ${body.engagementId}, ${user.id}, ${f.severity}, ${f.title}, ${f.evidence}, ${f.cwe})
            `;
            savedFindings.push({
              id: fid,
              engagement_id: body.engagementId,
              user_id: user.id,
              severity: f.severity,
              title: f.title,
              evidence: f.evidence,
              cwe: f.cwe,
              status: "open",
              created_at: new Date().toISOString(),
            });
          }
          const autoTitle =
            owned[0].title === "New engagement"
              ? content.replace(/\s+/g, " ").slice(0, 48)
              : null;
          if (autoTitle) {
            await sql`
              update engagements
              set title = ${autoTitle}, updated_at = now(), mode = ${mode}, model_id = ${model.id}
              where id = ${body.engagementId} and user_id = ${user.id}
            `;
          } else {
            await sql`
              update engagements
              set updated_at = now(), mode = ${mode}, model_id = ${model.id}
              where id = ${body.engagementId} and user_id = ${user.id}
            `;
          }
          send("done", {
            messageId: assistantId,
            content: stored,
            findings: savedFindings,
            title: autoTitle,
          });
        };

        const runLocal = async () => {
          const full = nodeAnalyst({ mode, content, lab, recon });
          send("delta", { text: full });
          await finish(full);
        };

        if (!apiKey) {
          await runLocal();
          return;
        }

        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-4.5",
            stream: true,
            temperature: model.temperature,
            max_tokens: 1400,
            messages: llmMessages,
          }),
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          console.error("[chat] xAI error", res.status, errText.slice(0, 400));
          await runLocal();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n");
          buffer = chunks.pop() ?? "";
          for (const line of chunks) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = json.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                full += delta;
                send("delta", { text: delta });
              }
            } catch {
              /* ignore partial json */
            }
          }
        }

        await finish(full);
      } catch (err) {
        console.error("[chat]", err);
        send("error", { error: "Operator pass failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
