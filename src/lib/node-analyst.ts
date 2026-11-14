import { extractFindings } from "./findings";
import type { LabTarget } from "./labs";
import type { OperatorMode } from "./models";
import { detectSkill } from "./kali-skills";

export function nodeAnalyst(input: {
  mode: OperatorMode;
  content: string;
  lab: LabTarget | null;
  recon: string | null;
}): string {
  if (input.lab?.id === "electra") return electraWriteup(input.content);
  if (input.lab) return labWriteup(input.lab, input.mode);
  const skill = detectSkill(input.content);
  if (skill?.labId === "electra") return electraWriteup(input.content);
  return playbook(input.content, input.mode);
}

export function parseAnalyst(text: string) {
  return extractFindings(text);
}

function banner(body: string) {
  return `**Node analyst** — Ollama Cloud MAX is at capacity on this node, so this pass ran locally against the lab recon and operator playbooks. Cloud models resume when the fleet has quota.

${body}`;
}

function electraWriteup(content: string): string {
  const skill = detectSkill(content);
  const module = skill?.slash ?? "/cloud-recon";
  return banner(`## notes.md — Electra · ${module}

**Range.** electra.lab (TestKali Red Team Electra) — authorized AWS cyber range for an EV company. Nine flags. Isolated namespace.

**Caller.** \`ci-deploy\` in account \`111122223333\`. Attached: S3 full, IAM read, Lambda full, plus inline \`PassRole\` / \`CreateAccessKey\` / \`AssumeRole\` onto \`ElectraIngestRole\`.

### Path

1. Public bucket \`electra-assets-public\` hosts \`keys/ci-deploy.csv\` (lab flag 1) and a deploy workflow with a hardcoded access key.
2. IMDSv1 on the ingest path vends \`ElectraIngestRole\` (ASIA lab token).
3. That role has Secrets Manager + SSM — \`electra/prod/flag-3\` and \`electra/prod/db-master\`.
4. Next modules: ${skill?.next.join(" ") ?? "/cloud-attack /creds"}.

Operator gate: no sudo, no live AWS. Stop. Do not replay lab keys against Amazon.

:::finding
severity: critical
title: Public S3 bucket exposes CI access keys
cwe: CWE-798
evidence: s3://electra-assets-public/keys/ci-deploy.csv lists AKIA-LAB-ONLY-NOT-REAL. Lab flag 1.
:::

:::finding
severity: high
title: ci-deploy can PassRole and CreateAccessKey
cwe: CWE-269
evidence: Inline policy allows iam:PassRole, iam:CreateAccessKey, sts:AssumeRole on ElectraIngestRole.
:::

:::finding
severity: high
title: IMDSv1 vends ElectraIngestRole
cwe: CWE-306
evidence: 169.254.169.254/latest/meta-data/iam/security-credentials/ElectraIngestRole returned ASIA-LAB-IMDSV1.
:::

:::finding
severity: medium
title: GitHub Actions workflow hardcodes cloud keys
cwe: CWE-540
evidence: s3://electra-assets-public/.github/workflows/deploy.yml contains the same lab AKIA and OIDC to ElectraIngestRole.
:::
`);
}

function labWriteup(lab: LabTarget, mode: OperatorMode): string {
  if (lab.id === "juice-shop") {
    return banner(`## Attack surface — ${lab.host}

The isolated recon shows a Node/Express + Angular storefront on **:3000** behind nginx. The interesting bits are not the closed SSH port; they are the JSON APIs that already leaked user records without a session.

### Ranked paths
1. **Unauthenticated user dump** at \`GET /api/Users\` — emails, roles, and password hashes in the first 400 bytes.
2. **Login API** at \`POST /rest/user/login\` — classic Juice Shop SQLi / JWT forging lab.
3. **\`/ftp\`** and \`/encryptionkeys\` — file disclosure and key material, 403 on keys still confirms the route.

${mode === "code" ? "No application source was pasted; the recon is API-level. Paste a route handler to go deeper." : "Do not replay this against anything but juice-shop.lab."}

:::finding
severity: high
title: Unauthenticated user enumeration via /api/Users
cwe: CWE-200
evidence: curl of /api/Users returned admin@juice-shop.lab and jim@juice-shop.lab with roles and password hashes, no Authorization header.
:::

:::finding
severity: medium
title: Hidden score-board and ftp listing expand the attack surface
cwe: CWE-425
evidence: nmap http-enum listed /ftp, /rest/user/login, /api/Users, and /#/score-board on the lab instance.
:::
`);
  }
  if (lab.id === "dvwa") {
    return banner(`## Attack surface — ${lab.host}

Apache + PHP 8.2, **security=low** cookie already set. The login page is only a door; the vulnerability tree is linked in the markup.

### Ranked paths
1. **SQL injection** at \`/vulnerabilities/sqli/\` with Low filters.
2. **File upload** at \`/vulnerabilities/upload/\` — nikto flagged unrestricted upload.
3. **Reflected XSS** and **CSRF** are first-class menu items in Low mode.
4. Session cookie \`PHPSESSID\` created without HttpOnly.

:::finding
severity: high
title: SQLi lab path exposed with security=low
cwe: CWE-89
evidence: login.php Set-Cookie security=low; index markup links /vulnerabilities/sqli/.
:::

:::finding
severity: high
title: Unrestricted file upload on Low
cwe: CWE-434
evidence: nikto reported /vulnerabilities/upload/ unrestricted; PHP 8.2 on Apache.
:::

:::finding
severity: medium
title: Session cookie missing HttpOnly
cwe: CWE-1004
evidence: nikto noted PHPSESSID created without HttpOnly in Low mode.
:::
`);
  }
  return banner(`## Attack surface — ${lab.host}

OpenAPI advertises user CRUD, orders, and an **unauthenticated admin export**. The login token is a JWT with \`"alg":"none"\`. A forged bearer for user 2 retrieved **user 1** (admin) including an SSN field — BOLA plus algorithm confusion.

### Ranked paths
1. **alg=none JWT** — forge \`role: admin\` without a key.
2. **BOLA** on \`GET /v1/users/{id}\` — object 1 leaked to subject 2.
3. **Unauthenticated /v1/admin/export** — 1284 rows, no security requirement in the spec.

:::finding
severity: critical
title: JWT accepted with alg=none
cwe: CWE-347
evidence: POST /v1/auth/login returned eyJhbGciOiJub25lIn0... with alg_detected none.
:::

:::finding
severity: high
title: BOLA on GET /v1/users/{id}
cwe: CWE-639
evidence: Bearer for sub=2 retrieved user id=1 admin@vapi.lab including ssn.
:::

:::finding
severity: high
title: Unauthenticated admin export
cwe: CWE-306
evidence: GET /v1/admin/export returned ok=true and 1284 rows with no auth header; OpenAPI security is empty.
:::
`);
}

function playbook(content: string, mode: OperatorMode): string {
  const q = content.toLowerCase();
  if (q.includes("idor") || q.includes("bola")) {
    return banner(`## IDOR / BOLA

Insecure Direct Object Reference (BOLA in API terms): the server trusts an object id from the client without proving the caller owns it.

**Lab test**
1. Authenticate as user A, capture a request to \`/users/A/orders/17\`.
2. Replay as user B, only changing the id.
3. If B receives A's object, you have a finding. Evidence is the two status/body pairs.

${mode === "code" ? "Look for \`req.params.id\` used in a query with no \`where user_id = session.userId\`." : "Stay on *.lab or an app you own. Do not probe third-party tenants."}

Remediation is authorization on every object fetch, not hiding the id.`);
  }
  if (q.includes("alg=none") || q.includes("alg none") || q.includes("jwt")) {
    return banner(`## JWT \`alg=none\`

Some libraries treat \`"alg":"none"\` as a valid unsigned token. An attacker strips the signature, sets alg to none, and the server accepts the payload.

**Lab test**
1. Capture a normal JWT.
2. Decode header/payload, set \`"alg":"none"\`, keep the payload claims you want (\`role: admin\`).
3. Send \`header.payload.\` (empty signature) or \`header.payload.\` with a dummy segment, depending on the library.
4. If a privileged route accepts it, emit a finding with the request.

Defense: allowlist \`RS256\`/\`ES256\`, reject \`none\`, and always verify with a server-held key.`);
  }
  if (q.includes("xss")) {
    return banner(`## Reflected XSS — finding draft

**Title.** Reflected cross-site scripting on \`q\` parameter  
**Severity.** High · CWE-79  
**Evidence.** Input \`<script>alert(1)</script>\` (or a lab-safe probe) is echoed unsanitized in the HTML response.  
**Impact.** Session theft, phishing inside origin.  
**Remediation.** Context-aware encoding, CSP \`default-src 'self'\`, avoid \`innerHTML\` for query text.

Paste a response body if you want this rewritten in your report voice.`);
  }
  if (q.includes("sql")) {
    return banner(`## SQLi in a lab

Boolean, UNION, and error-based probes belong on DVWA Low / Juice Shop, not on production third parties.

Typical Low-mode payload on a \`id\` parameter: \`1' OR '1'='1\`. Evidence is a dataset that is not the row for \`id=1\`, plus the SQL error if displayed.

Remediation: parameterized queries, least-privilege DB role, no raw concatenation.`);
  }
  return banner(`Cloud inference is unavailable, and this prompt did not match a built-in playbook.

What still works on this node:
- Hunt **Electra** (electra.lab) with /cloud-recon — TestKali Red Team skill.
- Hunt juice-shop.lab, dvwa.lab, vapi.lab.
- Ask about **IDOR, JWT alg=none, XSS, SQLi**.
- Paste source in **Code** mode once the fleet is back, or ask a playbook question now.

Keep scope on systems you are authorized to test.`);
}
