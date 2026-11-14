import { getBearerToken } from "@/lib/auth/client";
import type { OperatorMode } from "@/lib/models";
import type { Finding } from "@/lib/types";

export type StreamHandlers = {
  onRecon?: (payload: { id: string; content: string; labId: string | null }) => void;
  onDelta?: (text: string) => void;
  onDone?: (payload: {
    messageId: string;
    content: string;
    findings: Finding[];
    title: string | null;
  }) => void;
  onError?: (message: string) => void;
};

export async function streamChat(
  input: {
    engagementId: string;
    content: string;
    mode: OperatorMode;
    modelId: string;
  },
  handlers: StreamHandlers,
  signal?: AbortSignal,
) {
  const token = getBearerToken();
  const res = await fetch("/api/chat", {
    method: "POST",
    credentials: "include",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    handlers.onError?.(msg);
    return;
  }

  if (!res.body) {
    handlers.onError?.("Empty response");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
        continue;
      }
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw) continue;
      try {
        const data = JSON.parse(raw) as Record<string, unknown>;
        if (eventName === "delta") handlers.onDelta?.(String(data.text ?? ""));
        else if (eventName === "recon") {
          handlers.onRecon?.(data as { id: string; content: string; labId: string | null });
        } else if (eventName === "done") {
          handlers.onDone?.(
            data as {
              messageId: string;
              content: string;
              findings: Finding[];
              title: string | null;
            },
          );
        } else if (eventName === "error") {
          handlers.onError?.(String(data.error ?? "Cloud inference failed"));
        }
      } catch {
        /* ignore */
      }
      eventName = "message";
    }
  }
}
