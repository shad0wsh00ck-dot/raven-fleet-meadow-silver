import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { DEFAULT_MODEL_ID, type OperatorMode } from "@/lib/models";
import type { ChatMessage, Engagement, EngagementBundle, Finding } from "@/lib/types";

function newId() {
  return crypto.randomUUID();
}

export const listEngagements = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<Engagement>`
      select id, user_id, title, mode, model_id, lab_id, created_at, updated_at
      from engagements
      where user_id = ${context.userId}
      order by updated_at desc
    `;
  });

export const getEngagement = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }): Promise<EngagementBundle | null> => {
    const sql = await getSql();
    const rows = await sql<Engagement>`
      select id, user_id, title, mode, model_id, lab_id, created_at, updated_at
      from engagements
      where id = ${id} and user_id = ${context.userId}
      limit 1
    `;
    const engagement = rows[0];
    if (!engagement) return null;
    const messages = await sql<ChatMessage>`
      select id, engagement_id, user_id, role, content, kind, created_at
      from messages
      where engagement_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `;
    const findings = await sql<Finding>`
      select id, engagement_id, user_id, severity, title, evidence, cwe, status, created_at
      from findings
      where engagement_id = ${id} and user_id = ${context.userId}
      order by created_at desc
    `;
    return { engagement, messages, findings };
  });

export const createEngagement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title?: string; mode?: OperatorMode; modelId?: string; labId?: string | null }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = newId();
    const title = (data.title ?? "New engagement").trim() || "New engagement";
    const mode = data.mode ?? "chat";
    const modelId = data.modelId ?? DEFAULT_MODEL_ID;
    const labId = data.labId ?? null;
    await sql`
      insert into engagements (id, user_id, title, mode, model_id, lab_id)
      values (${id}, ${context.userId}, ${title}, ${mode}, ${modelId}, ${labId})
    `;
    const welcome =
      "Operator online. HackerAI Pro Max is connected to the Ollama Cloud MAX fleet.\n\nThis console is for authorized labs, CTFs, and code you own. Pick a lab target or describe a scoped engagement. Live scanning of third-party systems is refused.";
    await sql`
      insert into messages (id, engagement_id, user_id, role, content, kind)
      values (${newId()}, ${id}, ${context.userId}, ${"assistant"}, ${welcome}, ${"system"})
    `;
    const rows = await sql<Engagement>`
      select id, user_id, title, mode, model_id, lab_id, created_at, updated_at
      from engagements where id = ${id} and user_id = ${context.userId}
    `;
    return rows[0];
  });

export const updateEngagement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; title?: string; mode?: OperatorMode; modelId?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.title !== undefined) {
      const title = data.title.trim() || "Untitled";
      await sql`
        update engagements set title = ${title}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    if (data.mode !== undefined) {
      await sql`
        update engagements set mode = ${data.mode}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    if (data.modelId !== undefined) {
      await sql`
        update engagements set model_id = ${data.modelId}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    return { ok: true as const };
  });

export const deleteEngagement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from findings where engagement_id = ${id} and user_id = ${context.userId}`;
    await sql`delete from messages where engagement_id = ${id} and user_id = ${context.userId}`;
    await sql`delete from engagements where id = ${id} and user_id = ${context.userId}`;
    return { ok: true as const };
  });

export const addFinding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      engagementId: string;
      severity: string;
      title: string;
      evidence: string;
      cwe: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ id: string }>`
      select id from engagements where id = ${data.engagementId} and user_id = ${context.userId}
    `;
    if (!owned[0]) return null;
    const id = newId();
    await sql`
      insert into findings (id, engagement_id, user_id, severity, title, evidence, cwe)
      values (${id}, ${data.engagementId}, ${context.userId}, ${data.severity}, ${data.title}, ${data.evidence}, ${data.cwe})
    `;
    const rows = await sql<Finding>`
      select id, engagement_id, user_id, severity, title, evidence, cwe, status, created_at
      from findings where id = ${id} and user_id = ${context.userId}
    `;
    return rows[0] ?? null;
  });
