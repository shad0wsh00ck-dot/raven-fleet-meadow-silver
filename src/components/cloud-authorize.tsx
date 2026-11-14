import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mark } from "@/components/logo";
import { PLANS, writePlan, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/cn";
import { Cloud } from "lucide-react";

export function CloudAuthorize({ onLinked }: { onLinked: () => void }) {
  const [busy, setBusy] = useState(false);
  const [planId, setPlanId] = useState<PlanId>("ultra");
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];

  function authorize() {
    setBusy(true);
    writePlan(planId);
    window.setTimeout(() => {
      try {
        window.localStorage.setItem("hackerai.ollama.linked", "1");
      } catch {
        /* ignore */
      }
      onLinked();
    }, 700);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 grid-mesh opacity-60" />
      <div className="scanlines absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Mark className="size-10" />
          <div>
            <p className="text-lg font-semibold tracking-tight">HackerAI Pro Max</p>
            <p className="font-mono text-2xs uppercase tracking-widest text-subtle">
              Ollama Cloud · {plan.label}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-surface p-2 hairline">
          <div className="grid grid-cols-2 gap-2 p-1">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                className={cn(
                  "rounded-lg px-3 py-3 text-left hairline",
                  planId === p.id ? "bg-accent-dim text-accent" : "bg-elevated text-muted",
                )}
              >
                <p className="font-mono text-2xs uppercase tracking-widest">{p.label}</p>
                <p className="mt-1 text-sm text-fg">{p.concurrent} concurrent</p>
              </button>
            ))}
          </div>
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
              <dt className="text-subtle">Fleet</dt>
              <dd className="text-fg">ollama.com/cloud</dd>
            </dl>
          </div>
          <div className="px-5 py-6">
            <h1 className="text-xl font-semibold tracking-tight">Connect this operator</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{plan.blurb}</p>
            <Button className="mt-6 w-full" disabled={busy} onClick={authorize}>
              <Cloud className="size-4" />
              {busy ? `Linking ${plan.label} fleet…` : `Authorize ${plan.label} on Ollama Cloud`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
