export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type FindingDraft = {
  severity: Severity;
  title: string;
  evidence: string;
  cwe: string | null;
};

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "info"];

function asSeverity(value: string): Severity {
  const v = value.trim().toLowerCase();
  return SEVERITIES.includes(v as Severity) ? (v as Severity) : "info";
}

export function extractFindings(text: string): {
  cleaned: string;
  findings: FindingDraft[];
} {
  const findings: FindingDraft[] = [];
  const cleaned = text.replace(/:::finding\s*([\s\S]*?):::/gi, (_, body: string) => {
    const field = (name: string) => {
      const m = body.match(new RegExp(`^${name}:\\s*(.*)$`, "mi"));
      return m?.[1]?.trim() ?? "";
    };
    const title = field("title") || "Untitled finding";
    const evidence = field("evidence") || body.trim();
    const cweRaw = field("cwe");
    findings.push({
      severity: asSeverity(field("severity")),
      title,
      evidence,
      cwe: !cweRaw || cweRaw.toLowerCase() === "none" ? null : cweRaw,
    });
    return "";
  });
  return { cleaned: cleaned.replace(/\n{3,}/g, "\n\n").trim(), findings };
}
