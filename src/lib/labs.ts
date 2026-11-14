export type LabTarget = {
  id: string;
  host: string;
  name: string;
  blurb: string;
  prompt: string;
  recon: string;
};

export const LAB_TARGETS: LabTarget[] = [
  {
    id: "juice-shop",
    host: "juice-shop.lab",
    name: "OWASP Juice Shop",
    blurb: "Intentionally vulnerable storefront. Authorized lab only.",
    prompt:
      "Authorized lab hunt against juice-shop.lab (OWASP Juice Shop). Map the attack surface, prioritize likely OWASP Top 10 issues, and emit findings with evidence from the recon output. Do not suggest attacking any host outside this lab.",
    recon: `$ nmap -sV -sC juice-shop.lab
Starting Nmap 7.95 ( https://nmap.org )
Nmap scan report for juice-shop.lab (10.42.0.17)
Host is up (0.004s latency).
PORT     STATE SERVICE  VERSION
22/tcp   closed ssh
80/tcp   open   http    nginx 1.25.3
3000/tcp open   http    Node.js Express
|_http-title: OWASP Juice Shop
|_http-server-header: nginx/1.25.3
| http-enum:
|   /rest/user/login: login API
|   /api/Users: user collection
|   /ftp: anonymous ftp-style file listing
|_  /#/score-board: score board (hidden)

$ whatweb juice-shop.lab:3000
http://juice-shop.lab:3000 [200]
  AngularJS, Express, Node.js, nginx, X-Frame-Options: SAMEORIGIN,
  X-Content-Type-Options: nosniff, Cookies: token, language=en

$ curl -s http://juice-shop.lab:3000/rest/user/login -X OPTIONS
Allow: POST, OPTIONS
Content-Type: application/json

$ curl -s http://juice-shop.lab:3000/api/Users | head -c 400
{"status":"success","data":[{"id":1,"email":"admin@juice-shop.lab","password":"[REDACTED HASH]","role":"admin"},{"id":2,"email":"jim@juice-shop.lab","role":"customer"}]}

$ gobuster dir -u http://juice-shop.lab:3000 -w /opt/wordlists/common.txt -q
/ftp                 (Status: 200)
/rest                (Status: 200)
/api                 (Status: 200)
/snippets            (Status: 200)
/metrics             (Status: 200)
/promotion           (Status: 200)
/encryptionkeys      (Status: 403)

[sandbox] Isolated lab namespace. No packets left this operator node.`,
  },
  {
    id: "dvwa",
    host: "dvwa.lab",
    name: "DVWA",
    blurb: "Damn Vulnerable Web App on a private lab VLAN.",
    prompt:
      "Authorized lab hunt against dvwa.lab (Damn Vulnerable Web Application). Assume security level is Low. Identify SQLi, XSS, file upload, and CSRF paths from the recon. Emit findings with evidence. Lab-only.",
    recon: `$ nmap -sV dvwa.lab
Nmap scan report for dvwa.lab (10.42.0.24)
PORT    STATE SERVICE VERSION
80/tcp  open  http    Apache httpd 2.4.58 ((Debian))
|_http-title: Damn Vulnerable Web Application
|_http-generator: DVWA

$ curl -sI http://dvwa.lab/login.php
HTTP/1.1 200 OK
Server: Apache/2.4.58 (Debian)
Set-Cookie: PHPSESSID=7c4ea19bd02f; path=/
Set-Cookie: security=low; path=/
X-Powered-By: PHP/8.2.12

$ curl -s http://dvwa.lab/ | grep -oE 'href="[^"]+"' | head
href="login.php"
href="setup.php"
href="security.php"
href="vulnerabilities/sqli/"
href="vulnerabilities/xss_r/"
href="vulnerabilities/upload/"
href="vulnerabilities/csrf/"
href="vulnerabilities/fi/"
href="vulnerabilities/exec/"

$ nikto -h http://dvwa.lab -Tuning 1
+ /config/config.inc.php: PHP config may leak credentials
+ /phpinfo.php: PHP info page present on lab instance
+ Cookie PHPSESSID created without HttpOnly in Low mode
+ /vulnerabilities/upload/: unrestricted file upload (Low)

[sandbox] Isolated lab namespace. No packets left this operator node.`,
  },
  {
    id: "api-lab",
    host: "vapi.lab",
    name: "vAPI lab",
    blurb: "Broken REST API for BOLA / JWT practice.",
    prompt:
      "Authorized lab hunt against vapi.lab, a deliberately broken REST API. Focus on BOLA, JWT alg confusion, mass assignment, and verbose errors from the recon output. Emit findings with evidence. Lab-only.",
    recon: `$ nmap -sV vapi.lab
Nmap scan report for vapi.lab (10.42.0.31)
PORT     STATE SERVICE VERSION
443/tcp  open  https   nginx 1.25.3
|_http-title: vAPI
| ssl-cert: subject: CN=vapi.lab

$ curl -sk https://vapi.lab/v1/openapi.json | python -m json.tool | head -40
{
  "openapi": "3.0.3",
  "info": { "title": "vAPI", "version": "1.4" },
  "paths": {
    "/v1/auth/login": { "post": { "summary": "Login, returns JWT" } },
    "/v1/users": { "get": {}, "post": {} },
    "/v1/users/{id}": { "get": {}, "patch": {}, "delete": {} },
    "/v1/users/{id}/orders": { "get": {} },
    "/v1/admin/export": { "get": { "security": [] } }
  }
}

$ curl -sk -X POST https://vapi.lab/v1/auth/login \\
    -H 'Content-Type: application/json' \\
    -d '{"email":"demo@vapi.lab","password":"demo"}'
{"token":"eyJhbGciOiJub25lIn0.eyJzdWIiOiIyIiwicm9sZSI6InVzZXIifQ.","alg_detected":"none"}

$ curl -sk https://vapi.lab/v1/users/1 -H 'Authorization: Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiIyIiwicm9sZSI6InVzZXIifQ.'
{"id":1,"email":"admin@vapi.lab","role":"admin","ssn":"000-00-0000"}

$ curl -sk https://vapi.lab/v1/admin/export
{"ok":true,"note":"unauthenticated export on lab","rows":1284}

[sandbox] Isolated lab namespace. No packets left this operator node.`,
  },
  {
    id: "electra",
    host: "electra.lab",
    name: "Electra AWS range",
    blurb: "TestKali Red Team · nine-flag EV company in AWS. Authorized cyber range.",
    prompt:
      "Authorized TestKali Red Team Electra engagement. Run /cloud-recon against electra.lab (isolated AWS cyber range). Map IAM, S3, metadata, and CI identity from the recon dump. Emit findings with evidence. Do not target any real AWS account or public internet host.",
    recon: `$ aws sts get-caller-identity --profile electra-lab
{
  "UserId": "AIDAEXAMPLECIDEPLOY",
  "Account": "111122223333",
  "Arn": "arn:aws:iam::111122223333:user/ci-deploy"
}

$ aws iam list-attached-user-policies --user-name ci-deploy --profile electra-lab
AmazonS3FullAccess
IAMReadOnlyAccess
AWSLambda_FullAccess

$ aws iam list-user-policies --user-name ci-deploy --profile electra-lab
ci-deploy-inline
  { "Effect": "Allow", "Action": ["iam:PassRole","iam:CreateAccessKey","sts:AssumeRole"],
    "Resource": ["arn:aws:iam::111122223333:role/ElectraIngestRole",
                 "arn:aws:iam::111122223333:user/ci-deploy"] }

$ aws s3 ls --profile electra-lab
2026-03-02  electra-assets-public
2026-03-02  electra-telemetry-prod
2026-03-02  electra-tf-state

$ aws s3 ls s3://electra-assets-public --profile electra-lab
keys/ci-deploy.csv
lambda/ingest.zip
web/index.html
.github/workflows/deploy.yml

$ aws s3 cp s3://electra-assets-public/keys/ci-deploy.csv - --profile electra-lab
access_key_id,secret_access_key,note
AKIA-LAB-ONLY-NOT-REAL,wJalrXUtnFEMI/K7MDENG/bPxRfiCY-LAB,lab flag 1 — public bucket

$ aws s3 cp s3://electra-assets-public/.github/workflows/deploy.yml - --profile electra-lab
# OIDC to role ElectraIngestRole; also contains hardcoded AKIA-LAB-ONLY-NOT-REAL

$ curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/
ElectraIngestRole
$ curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/ElectraIngestRole
{"Code":"Success","Type":"AWS-HMAC","AccessKeyId":"ASIA-LAB-IMDSV1","Token":"[LAB]"}

$ aws iam get-role --role-name ElectraIngestRole --profile electra-lab
AssumeRolePolicyDocument allows iam:PassRole from ci-deploy
Attached: SecretsManagerReadWrite, AmazonSSMFullAccess

$ aws secretsmanager list-secrets --profile electra-lab
electra/prod/db-master
electra/prod/flag-3

[sandbox] Isolated Electra range. No packets left this operator node. Keys are lab tokens, not valid on AWS.`,
  },
];

const HOST_RE =
  /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|dev|app|cloud|ai|co|gg|xyz|to)\b/i;

export function detectLab(text: string): LabTarget | null {
  const lower = text.toLowerCase();
  return (
    LAB_TARGETS.find(
      (lab) =>
        lower.includes(lab.id) ||
        lower.includes(lab.host) ||
        lower.includes(lab.name.toLowerCase()),
    ) ?? null
  );
}

export function mentionsExternalHost(text: string): boolean {
  const matches = text.match(HOST_RE) ?? [];
  return matches.some((host) => {
    const h = host.toLowerCase();
    if (h.endsWith(".lab") || h.includes(".lab.")) return false;
    return !LAB_TARGETS.some((lab) => h.includes(lab.host) || lab.host.includes(h));
  });
}
