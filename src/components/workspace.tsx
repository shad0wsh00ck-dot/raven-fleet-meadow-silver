import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { SignedIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  createEngagement,
  deleteEngagement,
  getEngagement,
  listEngagements,
  updateEngagement,
} from "@/lib/engagements";
import { streamChat } from "@/lib/chat-client";
import { CLOUD_MODELS, modelAllowed, MODES, type OperatorMode } from "@/lib/models";
import { getPlan, readPlan, writePlan, type PlanId } from "@/lib/plans";
import { LAB_TARGETS } from "@/lib/labs";
import { ELECTRA_SKILL_IDS, KALI_SKILLS, skillById, type KaliSkill } from "@/lib/kali-skills";
import type { ChatMessage, Engagement, Finding } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Markdown, stripFindingBlocks } from "@/lib/markdown";
import { Wordmark } from "@/components/logo";
import { LoginView } from "@/components/login-view";
import { CloudAuthorize } from "@/components/cloud-authorize";
import { Mark } from "@/components/logo";
import { cn } from "@/lib/cn";
import {
  ChevronDown,
  Cpu,
  Cloud,
  FileSearch,
  Menu,
  Plus,
  Send,
  Shield,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Panel = "none" | "sidebar" | "rail";

const SEVERITY_CLASS: Record<string, string> = {
  critical: "text-danger",
  high: "text-danger",
  medium: "text-warn",
  low: "text-accent",
  info: "text-info",
};

export function Workspace() {
  const { sessionUser } = useRouteContext({ from: "__root__" });
  const { user, isPending } = useCurrentUserState();

  if (user) {
    return (
      <SignedIn>
        <OperatorConsole />
      </SignedIn>
    );
  }
  if (isPending && sessionUser) return <WorkspaceSkeleton />;
  return <LoginView />;
}

function WorkspaceSkeleton() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 grid-mesh opacity-60" />
      <div className="relative flex flex-col items-center px-6 text-center">
        <Mark className="size-12" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">HackerAI Pro Max</h1>
        <p className="mt-2 font-mono text-2xs uppercase tracking-widest text-accent">
          Ollama Cloud · MAX fleet
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Restoring the operator session. Authorized labs, evidence trail, isolated recon.
        </p>
      </div>
    </div>
  );
}

function OperatorConsole() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [mode, setMode] = useState<OperatorMode>("hunt");
  const [modelId, setModelId] = useState(CLOUD_MODELS[0].id);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [panel, setPanel] = useState<Panel>("none");
  const [modelOpen, setModelOpen] = useState(false);
  const [cloudLinked, setCloudLinked] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<PlanId>("max");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const loadList = useCallback(async () => {
    try {
      const rows = await listEngagements();
      setEngagements(rows);
      return rows;
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") return [];
      toast.error("Could not load engagements");
      return [];
    }
  }, []);

  const loadOne = useCallback(async (id: string) => {
    const bundle = await getEngagement({ data: id });
    if (!bundle) return;
    setMessages(bundle.messages);
    setFindings(bundle.findings);
    setMode(bundle.engagement.mode);
    setModelId(bundle.engagement.model_id);
  }, []);

  useEffect(() => {
    try {
      setCloudLinked(window.localStorage.getItem("hackerai.ollama.linked") === "1");
      setPlan(readPlan());
    } catch {
      setCloudLinked(true);
    }
  }, []);

  useEffect(() => {
    if (!cloudLinked) return;
    void (async () => {
      const rows = await loadList();
      if (rows[0]) {
        setActiveId(rows[0].id);
        await loadOne(rows[0].id);
      }
    })();
  }, [cloudLinked, loadList, loadOne]);

  async function newEngagement(opts?: {
    title?: string;
    mode?: OperatorMode;
    labId?: string;
    prompt?: string;
  }) {
    const created = await createEngagement({
      data: {
        title: opts?.title,
        mode: opts?.mode ?? "hunt",
        modelId,
        labId: opts?.labId ?? null,
      },
    });
    if (!created) return;
    setEngagements((prev) => [created, ...prev]);
    setActiveId(created.id);
    setMode(created.mode);
    setFindings([]);
    await loadOne(created.id);
    setPanel("none");
    if (opts?.prompt) {
      setDraft(opts.prompt);
      queueMicrotask(() => send(opts.prompt, created.id, created.mode));
    }
  }

  async function selectEngagement(id: string) {
    setActiveId(id);
    setStreaming("");
    await loadOne(id);
    setPanel("none");
  }

  async function removeEngagement(id: string) {
    await deleteEngagement({ data: id });
    const next = engagements.filter((e) => e.id !== id);
    setEngagements(next);
    if (activeId === id) {
      const fallback = next[0];
      setActiveId(fallback?.id ?? null);
      if (fallback) await loadOne(fallback.id);
      else {
        setMessages([]);
        setFindings([]);
      }
    }
  }

  async function changeMode(next: OperatorMode) {
    setMode(next);
    if (!activeId) return;
    await updateEngagement({ data: { id: activeId, mode: next } });
    setEngagements((prev) =>
      prev.map((e) => (e.id === activeId ? { ...e, mode: next } : e)),
    );
  }

  async function changeModel(id: string) {
    if (!modelAllowed(id, plan)) {
      setModelOpen(false);
      setUpgradeOpen(true);
      return;
    }
    setModelId(id);
    setModelOpen(false);
    if (!activeId) return;
    await updateEngagement({ data: { id: activeId, modelId: id } });
  }

  function upgrade() {
    writePlan("ultra");
    setPlan("ultra");
    setUpgradeOpen(false);
    toast.success("Ultra fleet linked");
  }

  async function send(text?: string, engagementId?: string, sendMode?: OperatorMode) {
    const content = (text ?? draft).trim();
    const eid = engagementId ?? activeId;
    if (!content || busy) return;
    let id = eid;
    if (!id) {
      const created = await createEngagement({ data: { title: "New engagement", mode, modelId } });
      if (!created) return;
      setEngagements((prev) => [created, ...prev]);
      setActiveId(created.id);
      id = created.id;
      await loadOne(created.id);
    }
    setDraft("");
    setBusy(true);
    setStreaming("");
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      engagement_id: id,
      user_id: "me",
      role: "user",
      content,
      kind: "text",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    await streamChat(
      { engagementId: id, content, mode: sendMode ?? mode, modelId },
      {
        onRecon: (payload) => {
          setMessages((prev) => [
            ...prev,
            {
              id: payload.id,
              engagement_id: id,
              user_id: "me",
              role: "assistant",
              content: payload.content,
              kind: "recon",
              created_at: new Date().toISOString(),
            },
          ]);
        },
        onDelta: (t) => setStreaming((s) => s + t),
        onDone: (payload) => {
          setStreaming("");
          setMessages((prev) => [
            ...prev,
            {
              id: payload.messageId,
              engagement_id: id,
              user_id: "me",
              role: "assistant",
              content: payload.content,
              kind: "text",
              created_at: new Date().toISOString(),
            },
          ]);
          if (payload.findings.length) {
            setFindings((prev) => [...payload.findings, ...prev]);
          }
          if (payload.title) {
            setEngagements((prev) =>
              prev.map((e) => (e.id === id ? { ...e, title: payload.title! } : e)),
            );
          }
        },
        onError: (message) => {
          setStreaming("");
          toast.error(message);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              engagement_id: id,
              user_id: "me",
              role: "assistant",
              content: message,
              kind: "system",
              created_at: new Date().toISOString(),
            },
          ]);
        },
      },
      ac.signal,
    );
    setBusy(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  const model = CLOUD_MODELS.find((m) => m.id === modelId) ?? CLOUD_MODELS[0];
  const activePlan = getPlan(plan);

  if (cloudLinked === null) return <WorkspaceSkeleton />;
  if (!cloudLinked) {
    return <CloudAuthorize onLinked={() => { setPlan(readPlan()); setCloudLinked(true); }} />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="flex h-14 items-center gap-2 border-b border-border px-3 sm:px-4">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden"
          onClick={() => setPanel((p) => (p === "sidebar" ? "none" : "sidebar"))}
          aria-label="Engagements"
        >
          <Menu className="size-5" />
        </button>
        <Wordmark compact />
        <span className="ml-1 hidden items-center gap-1.5 rounded-sm bg-accent-dim px-2 py-1 font-mono text-2xs uppercase tracking-widest text-accent sm:inline-flex">
          <span className="size-1.5 rounded-full bg-accent" />
          {activePlan.label} · {activePlan.concurrent}
        </span>
        {plan === "max" && (
          <button
            type="button"
            onClick={() => setUpgradeOpen(true)}
            className="inline-flex h-8 items-center rounded-sm bg-elevated px-2 font-mono text-2xs uppercase tracking-widest text-warn hairline"
          >
            Ultra
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setModelOpen((o) => !o)}
              className="flex h-11 items-center gap-2 rounded-md px-3 text-left text-sm hairline hover:bg-elevated"
            >
              <Cloud className="size-4 text-accent" />
              <span className="max-w-40 truncate font-mono text-xs">{model.ollamaName}</span>
              <ChevronDown className="size-3.5 text-muted" />
            </button>
            {modelOpen && (
              <div className="absolute right-0 z-20 mt-1 w-64 rounded-lg bg-surface p-1 hairline">
                {CLOUD_MODELS.map((m) => {
                  const locked = m.plan === "ultra" && plan !== "ultra";
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => void changeModel(m.id)}
                      className={cn(
                        "flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-elevated",
                        m.id === modelId && "bg-elevated",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2 font-mono text-xs">
                        {m.ollamaName}
                        {locked && <span className="text-warn">ULTRA</span>}
                      </span>
                      <span className="text-xs text-muted">{m.role}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden"
            onClick={() => setPanel((p) => (p === "rail" ? "none" : "rail"))}
            aria-label="Findings"
          >
            <FileSearch className="size-5" />
          </button>
          <div className="hidden sm:block [&_span]:text-sm [&_button]:text-muted">
            <UserButton />
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <aside
          className={cn(
            "z-30 flex w-72 shrink-0 flex-col border-r border-border bg-bg",
            "max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-xl",
            panel === "sidebar" ? "max-lg:flex" : "max-lg:hidden",
            "lg:flex",
          )}
        >
          <div className="flex items-center justify-between px-3 py-3">
            <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
              Engagements
            </p>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden"
              onClick={() => setPanel("none")}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="px-3">
            <Button className="w-full" size="md" onClick={() => void newEngagement()}>
              <Plus className="size-4" />
              New engagement
            </Button>
          </div>
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {engagements.length === 0 && (
              <p className="px-2 py-4 text-sm text-muted">No engagements yet.</p>
            )}
            {engagements.map((e) => (
              <div
                key={e.id}
                className={cn(
                  "group mb-1 flex items-center rounded-md px-2 py-1.5",
                  e.id === activeId ? "bg-elevated" : "hover:bg-elevated/70",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 py-2 text-left"
                  onClick={() => void selectEngagement(e.id)}
                >
                  <p className="truncate text-sm">{e.title}</p>
                  <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
                    {e.mode}
                  </p>
                </button>
                <button
                  type="button"
                  className="grid size-9 place-items-center rounded-sm text-subtle opacity-0 hover:text-danger group-hover:opacity-100"
                  aria-label="Delete engagement"
                  onClick={() => void removeEngagement(e.id)}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-3 py-3 sm:hidden">
            <UserButton />
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => void changeMode(m.id)}
                className={cn(
                  "h-11 rounded-md px-4 text-sm transition-colors duration-150",
                  mode === m.id ? "bg-elevated text-fg hairline" : "text-muted hover:text-fg",
                )}
              >
                {m.label}
                <span className="ml-2 hidden text-xs text-subtle sm:inline">{m.hint}</span>
              </button>
            ))}
          </div>

          <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            {messages.length === 0 && !streaming ? (
              <EmptyState
                onLab={(lab) =>
                  void newEngagement({
                    title: lab.name,
                    mode: "hunt",
                    labId: lab.id,
                    prompt: lab.prompt,
                  })
                }
                onSkill={(skill) =>
                  void newEngagement({
                    title: `${skill.slash} · ${skill.labId === "electra" ? "Electra" : skill.label}`,
                    mode: "hunt",
                    labId: skill.labId ?? undefined,
                    prompt: skill.prompt,
                  })
                }
                onPrompt={(p) => {
                  setMode("chat");
                  setDraft(p);
                  textareaRef.current?.focus();
                }}
              />
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-5">
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {busy && !streaming && (
                  <p className="font-mono text-xs text-accent">
                    Routing through Ollama Cloud MAX…
                  </p>
                )}
                {streaming && (
                  <div className="rounded-lg bg-surface px-4 py-3 hairline">
                    <Markdown text={stripFindingBlocks(streaming)} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border px-3 py-3 sm:px-6">
            <form
              className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl bg-surface p-2 hairline"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  mode === "hunt"
                    ? "Scope a lab hunt…  Enter to send"
                    : mode === "code"
                      ? "Paste code or ask for a review…"
                      : "Ask about a CVE, protocol, or method…"
                }
                className="min-h-11 flex-1 bg-transparent shadow-none focus:shadow-none"
              />
              <Button
                type="submit"
                size="icon"
                disabled={busy || !draft.trim()}
                aria-label="Send"
              >
                <Send className="size-4" />
              </Button>
            </form>
            <p className="mx-auto mt-2 max-w-3xl px-1 text-center text-2xs text-subtle">
              Authorized labs and owned systems only. Public hosts are refused for operational
              work.
            </p>
          </div>
        </main>

        <aside
          className={cn(
            "z-30 flex w-80 shrink-0 flex-col border-l border-border bg-bg",
            "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:shadow-xl",
            panel === "rail" ? "max-lg:flex" : "max-lg:hidden",
            "lg:flex",
          )}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
              Evidence
            </p>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden"
              onClick={() => setPanel("none")}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            <div className="rounded-lg bg-elevated p-3 hairline">
              <div className="flex items-center gap-2 text-accent">
                <Cloud className="size-4" />
                <p className="text-sm font-medium text-fg">Ollama Cloud MAX</p>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">{model.ollamaName}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                10 concurrent · isolated sandbox · evidence attached to this task.
              </p>
            </div>

            <p className="mb-2 mt-5 font-mono text-2xs uppercase tracking-widest text-subtle">
              Kali skills
            </p>
            <ul className="mb-5 flex flex-col gap-1">
              {ELECTRA_SKILL_IDS.map((id) => {
                const s = skillById(id);
                if (!s) return null;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-elevated"
                      onClick={() =>
                        void newEngagement({
                          title: `${s.slash} · Electra`,
                          mode: "hunt",
                          labId: "electra",
                          prompt: s.prompt,
                        })
                      }
                    >
                      <span className="font-mono text-xs text-accent">{s.slash}</span>
                      <span className="text-2xs text-muted">{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mb-2 mt-5 font-mono text-2xs uppercase tracking-widest text-subtle">
              Findings
            </p>
            {findings.length === 0 ? (
              <p className="text-sm text-muted">
                Hunt a lab target and confirmed issues will land here with evidence.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {findings.map((f) => (
                  <li key={f.id} className="rounded-md bg-elevated p-3 hairline">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "font-mono text-2xs uppercase tracking-widest",
                          SEVERITY_CLASS[f.severity] ?? "text-muted",
                        )}
                      >
                        {f.severity}
                      </span>
                      {f.cwe && <span className="font-mono text-2xs text-subtle">{f.cwe}</span>}
                    </div>
                    <p className="mt-1 text-sm font-medium">{f.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{f.evidence}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {panel !== "none" && (
          <button
            type="button"
            className="absolute inset-0 z-20 bg-bg/60 lg:hidden"
            aria-label="Dismiss panel"
            onClick={() => setPanel("none")}
          />
        )}
      </div>
      {upgradeOpen && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-bg/70 p-4 sm:place-items-center">
          <div className="w-full max-w-md rounded-2xl bg-surface p-5 hairline">
            <p className="font-mono text-2xs uppercase tracking-widest text-warn">Pro Max Ultra</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Priority fleet</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              32 concurrent slots, 90-day evidence, and Ultra models (Kimi K2, Qwen3 Next, DeepSeek
              R1). Same lab rules. Nothing leaves authorized targets.
            </p>
            <ul className="mt-4 flex flex-col gap-1 font-mono text-xs text-fg">
              <li>kimi-k2:ultra</li>
              <li>qwen3-next:ultra</li>
              <li>deepseek-r1:ultra</li>
            </ul>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={upgrade}>
                Link Ultra
              </Button>
              <Button variant="secondary" onClick={() => setUpgradeOpen(false)}>
                Stay on MAX
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.kind === "recon") {
    return (
      <div className="rounded-lg bg-bg px-4 py-3 hairline">
        <div className="mb-2 flex items-center gap-2 text-accent">
          <Terminal className="size-3.5" />
          <span className="font-mono text-2xs uppercase tracking-widest">
            Isolated lab recon
          </span>
        </div>
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-fg/90">
          {message.content}
        </pre>
      </div>
    );
  }
  if (message.role === "user") {
    return (
      <div className="ml-8 rounded-lg bg-accent-dim px-4 py-3 sm:ml-16">
        <p className="text-sm leading-relaxed text-fg whitespace-pre-wrap">{message.content}</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-surface px-4 py-3 hairline">
      {message.kind === "system" ? (
        <div className="flex gap-2">
          <Shield className="mt-0.5 size-4 shrink-0 text-accent" />
          <Markdown text={message.content} />
        </div>
      ) : (
        <Markdown text={message.content} />
      )}
    </div>
  );
}

function EmptyState({
  onLab,
  onSkill,
  onPrompt,
}: {
  onLab: (lab: (typeof LAB_TARGETS)[number]) => void;
  onSkill: (skill: KaliSkill) => void;
  onPrompt: (text: string) => void;
}) {
  const electra = LAB_TARGETS.find((l) => l.id === "electra");
  const electraSkills = ELECTRA_SKILL_IDS.map((id) => skillById(id)).filter(
    (s): s is KaliSkill => Boolean(s),
  );
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">
          TestKali · Red Team · Electra
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Start a scoped engagement.
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
          Hunt runs isolated recon against known labs. Electra is the AWS cyber range.
          Third-party production and the public internet are refused.
        </p>
      </div>
      {electra && (
        <button
          type="button"
          onClick={() => onLab(electra)}
          className="rounded-xl bg-surface p-5 text-left hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
        >
          <div className="flex items-center gap-2 text-accent">
            <Cpu className="size-4" />
            <span className="font-mono text-2xs uppercase tracking-widest">
              Featured skill
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-accent">{electra.host}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">{electra.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{electra.blurb}</p>
          <p className="mt-3 font-mono text-2xs uppercase tracking-widest text-subtle">
            Start /cloud-recon
          </p>
        </button>
      )}
      <div>
        <p className="mb-3 font-mono text-2xs uppercase tracking-widest text-subtle">
          Electra chain
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {electraSkills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => onSkill(skill)}
              className="rounded-lg bg-elevated p-3 text-left hairline hover:shadow-[var(--shadow-border-hover)]"
            >
              <p className="font-mono text-xs text-accent">{skill.slash}</p>
              <p className="mt-1 text-sm font-medium">{skill.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{skill.blurb}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-2xs uppercase tracking-widest text-subtle">
          Authorized labs
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {LAB_TARGETS.map((lab) => (
            <button
              key={lab.id}
              type="button"
              onClick={() => onLab(lab)}
              className="rounded-lg bg-surface p-4 text-left hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <p className="font-mono text-xs text-accent">{lab.host}</p>
              <p className="mt-1 text-sm font-medium">{lab.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{lab.blurb}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-2xs uppercase tracking-widest text-subtle">
          More Kali modules
        </p>
        <div className="flex flex-wrap gap-2">
          {KALI_SKILLS.filter((s) => !ELECTRA_SKILL_IDS.some((id) => id === s.id)).map(
            (skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => onSkill(skill)}
                className="h-11 rounded-md bg-elevated px-3 font-mono text-xs hairline hover:shadow-[var(--shadow-border-hover)]"
              >
                {skill.slash}
              </button>
            ),
          )}
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-2xs uppercase tracking-widest text-subtle">
          Quick prompts
        </p>
        <div className="flex flex-col gap-2">
          {[
            "Run TestKali Red Team Electra /cloud-recon on electra.lab.",
            "Explain JWT alg=none and how to test it in a lab.",
            "Draft a finding write-up for reflected XSS with remediation.",
          ].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPrompt(p)}
              className="rounded-md bg-elevated px-4 py-3 text-left text-sm text-fg/90 hairline hover:shadow-[var(--shadow-border-hover)]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
