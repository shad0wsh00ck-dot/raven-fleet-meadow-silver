import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient, GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mark } from "@/components/logo";
import { PLANS, writePlan, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/cn";
import { Cloud, KeyRound, ShieldCheck } from "lucide-react";

export function LoginView() {
  const navigate = useNavigate();
  const [emailMode, setEmailMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [planId, setPlanId] = useState<PlanId>("ultra");
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];

  function pickPlan(id: PlanId) {
    setPlanId(id);
    writePlan(id);
  }

  async function onProvider(providerId: string) {
    setError(null);
    setBusy(providerId);
    try {
      await signIn(providerId, { callbackURL: "/", errorCallbackURL: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(null);
    }
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("email");
    try {
      if (emailMode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Operator",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
      }
      await authClient.getSession();
      void navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cloud login failed");
      setBusy(null);
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 grid-mesh opacity-60" />
      <div className="scanlines absolute inset-0 opacity-40" />
      <div
        className="pointer-events-none absolute -left-24 top-24 size-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="hidden lg:block">
          <div className="flex items-center gap-3">
            <Mark className="size-10" />
            <div>
              <p className="text-lg font-semibold tracking-tight">HackerAI</p>
              <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
                Pro Max · {plan.label}
              </p>
            </div>
          </div>
          <h1 className="mt-10 max-w-xl text-4xl font-semibold tracking-tight leading-tight">
            Authorize this operator on the {plan.label} fleet.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Point it at a lab. It plans the hunt, keeps the evidence, and writes the finding.
            Cloud models run on Ollama Cloud. Identity stays with you.
          </p>
          <ul className="mt-10 grid max-w-md gap-4">
            {[
              {
                icon: Cloud,
                title: plan.id === "ultra" ? "Ollama Cloud ULTRA" : "Ollama Cloud MAX",
                body: plan.blurb,
              },
              {
                icon: ShieldCheck,
                title: "Isolated lab sandbox",
                body: "Recon stays inside authorized *.lab targets.",
              },
              {
                icon: KeyRound,
                title: "Evidence trail",
                body: "Every finding points back to a command or a snippet.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-0.5 grid size-9 place-items-center rounded-sm bg-elevated text-accent hairline">
                  <item.icon className="size-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Mark className="size-9" />
            <div>
              <p className="font-semibold tracking-tight">HackerAI Pro Max</p>
              <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
                Ollama Cloud login
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-2 hairline">
            <div className="rounded-xl bg-elevated px-5 py-4 hairline">
              <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
                Device authorization
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs">
                <dt className="text-subtle">Node</dt>
                <dd className="truncate text-fg">{plan.node}</dd>
                <dt className="text-subtle">Key</dt>
                <dd className="truncate text-accent">{plan.fingerprint}</dd>
                <dt className="text-subtle">Plan</dt>
                <dd className="text-fg">
                  {plan.label} · {plan.concurrent} concurrent
                </dd>
              </dl>
            </div>

            <div className="px-5 pb-6 pt-5">
              <h2 className="text-lg font-semibold tracking-tight">Connect Ollama Cloud</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickPlan(p.id)}
                    className={cn(
                      "rounded-md px-3 py-2 text-left hairline",
                      planId === p.id ? "bg-accent-dim text-accent" : "text-muted hover:bg-elevated",
                    )}
                  >
                    <span className="font-mono text-2xs uppercase tracking-widest">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-fg">{p.concurrent} slots</span>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Sign in to authorize this operator. Gate viewers are already connected.
              </p>

              {authEnabled ? (
                <div className="mt-5 flex flex-col gap-2">
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      variant="secondary"
                      className="w-full"
                      disabled={busy !== null}
                      onClick={() => onProvider(p.providerId)}
                    >
                      {busy === p.providerId ? "Connecting…" : `Continue with ${p.label}`}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>
              )}

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-2xs uppercase tracking-widest text-subtle">
                  Cloud email
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={onEmail} className="flex flex-col gap-2">
                {emailMode === "signup" && (
                  <Input
                    autoComplete="name"
                    placeholder="Operator name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@lab.mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  autoComplete={emailMode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  placeholder="Password · 8+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" className="mt-1 w-full" disabled={busy !== null}>
                  {busy === "email"
                    ? "Authorizing…"
                    : emailMode === "signup"
                      ? `Create ${plan.label} account`
                      : "Authorize node"}
                </Button>
              </form>

              <button
                type="button"
                className={cn(
                  "mt-3 w-full text-center text-sm text-muted transition-opacity duration-150 hover:text-fg",
                )}
                onClick={() => {
                  setEmailMode((m) => (m === "signin" ? "signup" : "signin"));
                  setError(null);
                }}
              >
                {emailMode === "signin"
                  ? "Need a cloud account? Create one"
                  : "Already authorized? Sign in"}
              </button>

              {error && (
                <p className="mt-3 text-sm text-danger" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
          <p className="mt-4 px-1 text-center text-xs leading-relaxed text-subtle">
            Authorized testing only. Identity via Google, X, or email. Inference on the Pro Max
            cloud fleet.
          </p>
        </section>
      </div>
    </div>
  );
}
