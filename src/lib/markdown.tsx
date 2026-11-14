import type { ReactNode } from "react";
import { cn } from "./cn";

function inlineFormat(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-xs bg-elevated px-1 py-0.5 font-mono text-2xs text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderBlock(block: string, i: number) {
  if (block.startsWith("```")) {
    const nl = block.indexOf("\n");
    const body = nl === -1 ? "" : block.slice(nl + 1).replace(/```$/, "").trimEnd();
    const lang = nl === -1 ? "" : block.slice(3, nl).trim();
    return (
      <pre
        key={i}
        className="overflow-x-auto rounded-md bg-bg px-3 py-3 font-mono text-xs leading-relaxed text-fg hairline"
      >
        {lang ? (
          <div className="mb-2 font-mono text-2xs uppercase tracking-widest text-subtle">
            {lang}
          </div>
        ) : null}
        <code>{body}</code>
      </pre>
    );
  }

  if (block.startsWith("### ")) {
    return (
      <h3 key={i} className="text-sm font-semibold tracking-tight">
        {inlineFormat(block.slice(4))}
      </h3>
    );
  }
  if (block.startsWith("## ")) {
    return (
      <h2 key={i} className="text-base font-semibold tracking-tight">
        {inlineFormat(block.slice(3))}
      </h2>
    );
  }
  if (block.startsWith("# ")) {
    return (
      <h2 key={i} className="text-base font-semibold tracking-tight">
        {inlineFormat(block.slice(2))}
      </h2>
    );
  }

  if (block.startsWith("- ") || block.startsWith("* ")) {
    const items = block.split("\n").filter(Boolean);
    return (
      <ul key={i} className="space-y-1 pl-4 text-sm leading-relaxed text-fg">
        {items.map((item, j) => (
          <li key={j} className="list-disc">
            {inlineFormat(item.replace(/^[-*]\s+/, ""))}
          </li>
        ))}
      </ul>
    );
  }

  if (/^\d+\.\s/.test(block)) {
    const items = block.split("\n").filter(Boolean);
    return (
      <ol key={i} className="space-y-1 pl-4 text-sm leading-relaxed text-fg">
        {items.map((item, j) => (
          <li key={j} className="list-decimal">
            {inlineFormat(item.replace(/^\d+\.\s+/, ""))}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p key={i} className="text-sm leading-relaxed text-fg/90">
      {inlineFormat(block)}
    </p>
  );
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const blocks: string[] = [];
  const fence = /```[\s\S]*?```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(text))) {
    if (m.index > last) blocks.push(text.slice(last, m.index).trim());
    blocks.push(m[0]);
    last = m.index + m[0].length;
  }
  if (last < text.length) blocks.push(text.slice(last).trim());

  const expanded: string[] = [];
  for (const b of blocks) {
    if (b.startsWith("```")) expanded.push(b);
    else {
      for (const para of b.split(/\n{2,}/)) {
        if (para.trim()) expanded.push(para.trim());
      }
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {expanded.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

export function stripFindingBlocks(text: string) {
  return text.replace(/:::finding[\s\S]*?(:::|$)/gi, "").trim();
}
