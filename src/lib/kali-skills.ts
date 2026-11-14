export type SkillCategory = "recon" | "attack" | "factory" | "post" | "support";

export type KaliSkill = {
  id: string;
  slash: string;
  label: string;
  category: SkillCategory;
  blurb: string;
  next: string[];
  labId: string | null;
  prompt: string;
};

export const KALI_SKILLS: KaliSkill[] = [
  {
    id: "recon",
    slash: "/recon",
    label: "Recon",
    category: "recon",
    blurb: "Hosts, ports, banners. Read-only.",
    next: ["/web-recon", "/cloud-recon"],
    labId: null,
    prompt:
      "Run Kali red-team module /recon on the authorized lab in scope. Map hosts and services from isolated recon only. Suggest the next module. Lab-only.",
  },
  {
    id: "web-recon",
    slash: "/web-recon",
    label: "Web recon",
    category: "recon",
    blurb: "Paths, APIs, CMS, WAF edge.",
    next: ["/web-attack"],
    labId: null,
    prompt:
      "Run /web-recon on the authorized lab. Build an attack-surface card from the recon dump. Do not touch hosts outside *.lab.",
  },
  {
    id: "web-attack",
    slash: "/web-attack",
    label: "Web attack",
    category: "attack",
    blurb: "Injection, JWT, SSRF — lab chains.",
    next: ["/creds", "/privesc-linux"],
    labId: null,
    prompt:
      "Run /web-attack against the authorized lab using only evidence in recon. Emit findings. No live internet targets.",
  },
  {
    id: "cloud-recon",
    slash: "/cloud-recon",
    label: "Cloud recon",
    category: "recon",
    blurb: "IAM, buckets, roles, metadata.",
    next: ["/cloud-attack", "/creds"],
    labId: "electra",
    prompt:
      "Run Kali red-team skill /cloud-recon against electra.lab (authorized AWS cyber range, TestKali Red Team Electra). Enumerate identity, IAM, S3, and metadata from the isolated recon dump. Record notes and recommend /cloud-attack or /creds. Lab-only.",
  },
  {
    id: "cloud-attack",
    slash: "/cloud-attack",
    label: "Cloud attack",
    category: "attack",
    blurb: "IAM privesc, role assume, serverless.",
    next: ["/creds", "/privesc-linux", "/post"],
    labId: "electra",
    prompt:
      "Run /cloud-attack on electra.lab. From the recon dump, show the IAM privilege path and emit findings. Authorized range only — no real AWS accounts.",
  },
  {
    id: "k8s",
    slash: "/k8s",
    label: "Kubernetes",
    category: "attack",
    blurb: "RBAC, secrets, node identity.",
    next: ["/cloud-recon", "/privesc-linux"],
    labId: "electra",
    prompt:
      "Run /k8s against the Electra lab cluster described in recon. Lab-only. Emit findings with evidence.",
  },
  {
    id: "cicd",
    slash: "/cicd",
    label: "CI/CD",
    category: "attack",
    blurb: "Actions, runners, OIDC, registries.",
    next: ["/cloud-recon", "/creds"],
    labId: "electra",
    prompt:
      "Run /cicd on electra.lab CI (GitHub Actions OIDC / runners) using isolated recon. Lab-only.",
  },
  {
    id: "creds",
    slash: "/creds",
    label: "Creds",
    category: "factory",
    blurb: "Secrets, keys, spray policy in-lab.",
    next: ["/cloud-attack", "/post"],
    labId: "electra",
    prompt:
      "Run /creds on electra.lab. Identify leaked keys and secrets from recon. Do not use recovered material against any real cloud account.",
  },
  {
    id: "privesc-linux",
    slash: "/privesc-linux",
    label: "Linux privesc",
    category: "attack",
    blurb: "sudo, SUID, capabilities.",
    next: ["/creds", "/post"],
    labId: null,
    prompt:
      "Run /privesc-linux on the authorized lab host. Use only the recon dump. Lab-only.",
  },
  {
    id: "post",
    slash: "/post",
    label: "Post-ex",
    category: "post",
    blurb: "Notes, loot, cleanup checklist.",
    next: ["/creds"],
    labId: null,
    prompt:
      "Run /post on the authorized lab. Summarize objective status, loot, and a cleanup checklist. No persistence against real systems.",
  },
  {
    id: "shell",
    slash: "/shell",
    label: "Shell",
    category: "support",
    blurb: "Session notes — no live C2.",
    next: ["/privesc-linux", "/post"],
    labId: null,
    prompt:
      "Run /shell as lab session notes only. Describe how a stable lab PTY would be verified. Do not generate internet C2 payloads.",
  },
  {
    id: "tunnel",
    slash: "/tunnel",
    label: "Tunnel",
    category: "support",
    blurb: "Lab pivot theory.",
    next: ["/recon"],
    labId: null,
    prompt:
      "Run /tunnel as a lab pivot plan (ligolo/chisel concepts) for the in-scope range. No internet listeners.",
  },
];

export const ELECTRA_SKILL_IDS = ["cloud-recon", "cloud-attack", "creds", "cicd", "k8s", "post"] as const;

export function detectSkill(text: string): KaliSkill | null {
  const lower = text.toLowerCase();
  const bySlash = KALI_SKILLS.find((s) => lower.includes(s.slash));
  if (bySlash) return bySlash;
  if (lower.includes("electra") && (lower.includes("cloud") || lower.includes("aws") || lower.includes("red team") || lower.includes("redteam") || lower.includes("testkali"))) {
    return KALI_SKILLS.find((s) => s.id === "cloud-recon") ?? null;
  }
  return KALI_SKILLS.find((s) => lower.includes(s.id.replace("-", " "))) ?? null;
}

export function skillById(id: string): KaliSkill | undefined {
  return KALI_SKILLS.find((s) => s.id === id);
}
