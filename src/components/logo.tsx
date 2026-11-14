import { cn } from "@/lib/cn";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="26" height="26" rx="6" fill="currentColor" opacity="0.14" />
      <path
        d="M10 16h5.2L13 9h6l-2.2 7H22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M10 20h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        opacity="0.7"
      />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Mark className="size-8" />
      <div className="leading-none">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-tight">HackerAI</span>
          {!compact && (
            <span className="rounded-sm bg-accent-dim px-1.5 py-0.5 font-mono text-2xs font-medium uppercase tracking-widest text-accent">
              Max
            </span>
          )}
        </div>
        {!compact && (
          <p className="mt-1 font-mono text-2xs uppercase tracking-widest text-subtle">
            Ollama Cloud
          </p>
        )}
      </div>
    </div>
  );
}
