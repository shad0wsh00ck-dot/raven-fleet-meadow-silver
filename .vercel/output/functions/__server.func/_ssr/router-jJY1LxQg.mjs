import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D8jQpDG7.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-BhKN53z1.mjs";
import { r as auth, t as getSessionUser } from "./verify.server-C4w1ZEsG.mjs";
import { t as assertSameSiteRequest } from "./isolation.server-d-EuYjiq.mjs";
import { i as getModel } from "./models-Dz5Y5iYL.mjs";
import { C as useRouter, _ as lazyRouteComponent, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, qt as require_react, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/router-jJY1LxQg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/lib/error-component.tsx";
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 21,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 20,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 23,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 24,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 14,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/lib/auth/provider.tsx";
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children }, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 14,
		columnNumber: 10
	}, this);
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("84e93aa9a4240c380045ee2a2b03d040f71423f1e8e84c8eba0a02080539bf41"));
var styles_default = "/assets/styles-DSHZWrMX.css";
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
var APP_NAME = "HackerAI Pro Max";
var Route$4 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "HackerAI Pro Max — authorized pentest operator console on the Ollama Cloud MAX fleet."
			},
			{
				name: "theme-color",
				content: "#08090a"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootShell
});
function RootShell() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 50,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 49,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PreviewHostBridge, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 11
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
					theme: "dark",
					position: "bottom-right",
					toastOptions: { className: "!bg-elevated !text-fg !border-border !font-[family-name:var(--font-sans)]" }
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 65,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 52,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 48,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$1 = () => import("./routes-Chn0TFYg.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./login-CkcssGQo.mjs");
var Route$2 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SEVERITIES = [
	"critical",
	"high",
	"medium",
	"low",
	"info"
];
function asSeverity(value) {
	const v = value.trim().toLowerCase();
	return SEVERITIES.includes(v) ? v : "info";
}
function extractFindings(text) {
	const findings = [];
	return {
		cleaned: text.replace(/:::finding\s*([\s\S]*?):::/gi, (_, body) => {
			const field = (name) => {
				return body.match(new RegExp(`^${name}:\\s*(.*)$`, "mi"))?.[1]?.trim() ?? "";
			};
			const title = field("title") || "Untitled finding";
			const evidence = field("evidence") || body.trim();
			const cweRaw = field("cwe");
			findings.push({
				severity: asSeverity(field("severity")),
				title,
				evidence,
				cwe: !cweRaw || cweRaw.toLowerCase() === "none" ? null : cweRaw
			});
			return "";
		}).replace(/\n{3,}/g, "\n\n").trim(),
		findings
	};
}
var LAB_TARGETS = [
	{
		id: "juice-shop",
		host: "juice-shop.lab",
		name: "OWASP Juice Shop",
		blurb: "Intentionally vulnerable storefront. Authorized lab only.",
		prompt: "Authorized lab hunt against juice-shop.lab (OWASP Juice Shop). Map the attack surface, prioritize likely OWASP Top 10 issues, and emit findings with evidence from the recon output. Do not suggest attacking any host outside this lab.",
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

[sandbox] Isolated lab namespace. No packets left this operator node.`
	},
	{
		id: "dvwa",
		host: "dvwa.lab",
		name: "DVWA",
		blurb: "Damn Vulnerable Web App on a private lab VLAN.",
		prompt: "Authorized lab hunt against dvwa.lab (Damn Vulnerable Web Application). Assume security level is Low. Identify SQLi, XSS, file upload, and CSRF paths from the recon. Emit findings with evidence. Lab-only.",
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

[sandbox] Isolated lab namespace. No packets left this operator node.`
	},
	{
		id: "api-lab",
		host: "vapi.lab",
		name: "vAPI lab",
		blurb: "Broken REST API for BOLA / JWT practice.",
		prompt: "Authorized lab hunt against vapi.lab, a deliberately broken REST API. Focus on BOLA, JWT alg confusion, mass assignment, and verbose errors from the recon output. Emit findings with evidence. Lab-only.",
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

[sandbox] Isolated lab namespace. No packets left this operator node.`
	},
	{
		id: "electra",
		host: "electra.lab",
		name: "Electra AWS range",
		blurb: "TestKali Red Team · nine-flag EV company in AWS. Authorized cyber range.",
		prompt: "Authorized TestKali Red Team Electra engagement. Run /cloud-recon against electra.lab (isolated AWS cyber range). Map IAM, S3, metadata, and CI identity from the recon dump. Emit findings with evidence. Do not target any real AWS account or public internet host.",
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

[sandbox] Isolated Electra range. No packets left this operator node. Keys are lab tokens, not valid on AWS.`
	}
];
var HOST_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|dev|app|cloud|ai|co|gg|xyz|to)\b/i;
function detectLab(text) {
	const lower = text.toLowerCase();
	return LAB_TARGETS.find((lab) => lower.includes(lab.id) || lower.includes(lab.host) || lower.includes(lab.name.toLowerCase())) ?? null;
}
function mentionsExternalHost(text) {
	return (text.match(HOST_RE) ?? []).some((host) => {
		const h = host.toLowerCase();
		if (h.endsWith(".lab") || h.includes(".lab.")) return false;
		return !LAB_TARGETS.some((lab) => h.includes(lab.host) || lab.host.includes(h));
	});
}
var KALI_SKILLS = [
	{
		id: "recon",
		slash: "/recon",
		label: "Recon",
		category: "recon",
		blurb: "Hosts, ports, banners. Read-only.",
		next: ["/web-recon", "/cloud-recon"],
		labId: null,
		prompt: "Run Kali red-team module /recon on the authorized lab in scope. Map hosts and services from isolated recon only. Suggest the next module. Lab-only."
	},
	{
		id: "web-recon",
		slash: "/web-recon",
		label: "Web recon",
		category: "recon",
		blurb: "Paths, APIs, CMS, WAF edge.",
		next: ["/web-attack"],
		labId: null,
		prompt: "Run /web-recon on the authorized lab. Build an attack-surface card from the recon dump. Do not touch hosts outside *.lab."
	},
	{
		id: "web-attack",
		slash: "/web-attack",
		label: "Web attack",
		category: "attack",
		blurb: "Injection, JWT, SSRF — lab chains.",
		next: ["/creds", "/privesc-linux"],
		labId: null,
		prompt: "Run /web-attack against the authorized lab using only evidence in recon. Emit findings. No live internet targets."
	},
	{
		id: "cloud-recon",
		slash: "/cloud-recon",
		label: "Cloud recon",
		category: "recon",
		blurb: "IAM, buckets, roles, metadata.",
		next: ["/cloud-attack", "/creds"],
		labId: "electra",
		prompt: "Run Kali red-team skill /cloud-recon against electra.lab (authorized AWS cyber range, TestKali Red Team Electra). Enumerate identity, IAM, S3, and metadata from the isolated recon dump. Record notes and recommend /cloud-attack or /creds. Lab-only."
	},
	{
		id: "cloud-attack",
		slash: "/cloud-attack",
		label: "Cloud attack",
		category: "attack",
		blurb: "IAM privesc, role assume, serverless.",
		next: [
			"/creds",
			"/privesc-linux",
			"/post"
		],
		labId: "electra",
		prompt: "Run /cloud-attack on electra.lab. From the recon dump, show the IAM privilege path and emit findings. Authorized range only — no real AWS accounts."
	},
	{
		id: "k8s",
		slash: "/k8s",
		label: "Kubernetes",
		category: "attack",
		blurb: "RBAC, secrets, node identity.",
		next: ["/cloud-recon", "/privesc-linux"],
		labId: "electra",
		prompt: "Run /k8s against the Electra lab cluster described in recon. Lab-only. Emit findings with evidence."
	},
	{
		id: "cicd",
		slash: "/cicd",
		label: "CI/CD",
		category: "attack",
		blurb: "Actions, runners, OIDC, registries.",
		next: ["/cloud-recon", "/creds"],
		labId: "electra",
		prompt: "Run /cicd on electra.lab CI (GitHub Actions OIDC / runners) using isolated recon. Lab-only."
	},
	{
		id: "creds",
		slash: "/creds",
		label: "Creds",
		category: "factory",
		blurb: "Secrets, keys, spray policy in-lab.",
		next: ["/cloud-attack", "/post"],
		labId: "electra",
		prompt: "Run /creds on electra.lab. Identify leaked keys and secrets from recon. Do not use recovered material against any real cloud account."
	},
	{
		id: "privesc-linux",
		slash: "/privesc-linux",
		label: "Linux privesc",
		category: "attack",
		blurb: "sudo, SUID, capabilities.",
		next: ["/creds", "/post"],
		labId: null,
		prompt: "Run /privesc-linux on the authorized lab host. Use only the recon dump. Lab-only."
	},
	{
		id: "post",
		slash: "/post",
		label: "Post-ex",
		category: "post",
		blurb: "Notes, loot, cleanup checklist.",
		next: ["/creds"],
		labId: null,
		prompt: "Run /post on the authorized lab. Summarize objective status, loot, and a cleanup checklist. No persistence against real systems."
	},
	{
		id: "shell",
		slash: "/shell",
		label: "Shell",
		category: "support",
		blurb: "Session notes — no live C2.",
		next: ["/privesc-linux", "/post"],
		labId: null,
		prompt: "Run /shell as lab session notes only. Describe how a stable lab PTY would be verified. Do not generate internet C2 payloads."
	},
	{
		id: "tunnel",
		slash: "/tunnel",
		label: "Tunnel",
		category: "support",
		blurb: "Lab pivot theory.",
		next: ["/recon"],
		labId: null,
		prompt: "Run /tunnel as a lab pivot plan (ligolo/chisel concepts) for the in-scope range. No internet listeners."
	}
];
var ELECTRA_SKILL_IDS = [
	"cloud-recon",
	"cloud-attack",
	"creds",
	"cicd",
	"k8s",
	"post"
];
function detectSkill(text) {
	const lower = text.toLowerCase();
	const bySlash = KALI_SKILLS.find((s) => lower.includes(s.slash));
	if (bySlash) return bySlash;
	if (lower.includes("electra") && (lower.includes("cloud") || lower.includes("aws") || lower.includes("red team") || lower.includes("redteam") || lower.includes("testkali"))) return KALI_SKILLS.find((s) => s.id === "cloud-recon") ?? null;
	return KALI_SKILLS.find((s) => lower.includes(s.id.replace("-", " "))) ?? null;
}
function skillById(id) {
	return KALI_SKILLS.find((s) => s.id === id);
}
function nodeAnalyst(input) {
	if (input.lab?.id === "electra") return electraWriteup(input.content);
	if (input.lab) return labWriteup(input.lab, input.mode);
	if (detectSkill(input.content)?.labId === "electra") return electraWriteup(input.content);
	return playbook(input.content, input.mode);
}
function banner(body) {
	return `**Node analyst** — Ollama Cloud MAX is at capacity on this node, so this pass ran locally against the lab recon and operator playbooks. Cloud models resume when the fleet has quota.

${body}`;
}
function electraWriteup(content) {
	const skill = detectSkill(content);
	return banner(`## notes.md — Electra · ${skill?.slash ?? "/cloud-recon"}

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
function labWriteup(lab, mode) {
	if (lab.id === "juice-shop") return banner(`## Attack surface — ${lab.host}

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
	if (lab.id === "dvwa") return banner(`## Attack surface — ${lab.host}

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
function playbook(content, mode) {
	const q = content.toLowerCase();
	if (q.includes("idor") || q.includes("bola")) return banner(`## IDOR / BOLA

Insecure Direct Object Reference (BOLA in API terms): the server trusts an object id from the client without proving the caller owns it.

**Lab test**
1. Authenticate as user A, capture a request to \`/users/A/orders/17\`.
2. Replay as user B, only changing the id.
3. If B receives A's object, you have a finding. Evidence is the two status/body pairs.

${mode === "code" ? "Look for `req.params.id` used in a query with no `where user_id = session.userId`." : "Stay on *.lab or an app you own. Do not probe third-party tenants."}

Remediation is authorization on every object fetch, not hiding the id.`);
	if (q.includes("alg=none") || q.includes("alg none") || q.includes("jwt")) return banner(`## JWT \`alg=none\`

Some libraries treat \`"alg":"none"\` as a valid unsigned token. An attacker strips the signature, sets alg to none, and the server accepts the payload.

**Lab test**
1. Capture a normal JWT.
2. Decode header/payload, set \`"alg":"none"\`, keep the payload claims you want (\`role: admin\`).
3. Send \`header.payload.\` (empty signature) or \`header.payload.\` with a dummy segment, depending on the library.
4. If a privileged route accepts it, emit a finding with the request.

Defense: allowlist \`RS256\`/\`ES256\`, reject \`none\`, and always verify with a server-held key.`);
	if (q.includes("xss")) return banner(`## Reflected XSS — finding draft

**Title.** Reflected cross-site scripting on \`q\` parameter  
**Severity.** High · CWE-79  
**Evidence.** Input \`<script>alert(1)<\/script>\` (or a lab-safe probe) is echoed unsanitized in the HTML response.  
**Impact.** Session theft, phishing inside origin.  
**Remediation.** Context-aware encoding, CSP \`default-src 'self'\`, avoid \`innerHTML\` for query text.

Paste a response body if you want this rewritten in your report voice.`);
	if (q.includes("sql")) return banner(`## SQLi in a lab

Boolean, UNION, and error-based probes belong on DVWA Low / Juice Shop, not on production third parties.

Typical Low-mode payload on a \`id\` parameter: \`1' OR '1'='1\`. Evidence is a dataset that is not the row for \`id=1\`, plus the SQL error if displayed.

Remediation: parameterized queries, least-privilege DB role, no raw concatenation.`);
	return banner(`Cloud inference is unavailable, and this prompt did not match a built-in playbook.

What still works on this node:
- Hunt **Electra** (electra.lab) with /cloud-recon — TestKali Red Team skill.
- Hunt juice-shop.lab, dvwa.lab, vapi.lab.
- Ask about **IDOR, JWT alg=none, XSS, SQLi**.
- Paste source in **Code** mode once the fleet is back, or ask a playbook question now.

Keep scope on systems you are authorized to test.`);
}
var SHARED_RULES = `You are HackerAI Pro Max, an operator assistant for authorized penetration testing, CTF work, and secure code review.

Hard rules:
- Only help with systems the user owns, has written permission to test, or that are known lab/CTF targets (*.lab, localhost, Juice Shop, DVWA, vAPI, HackTheBox/TryHackMe-style labs).
- Refuse live scanning, exploitation, credential stuffing, malware, or attacks against third-party production systems. If a public hostname or public IP appears, refuse the operational work and offer a lab alternative or a conceptual explanation.
- Prefer defensive framing: detection, impact, and remediation sit next to every issue.
- Be concrete: commands, payloads, and request/response examples belong in fenced code blocks, marked as lab-only when they are operational.
- Never claim you executed a tool against a live network. Recon dumps you receive are from an isolated lab sandbox.

When you confirm a vulnerability from evidence, emit one or more finding blocks in exactly this form (no extra fences around the block):

:::finding
severity: critical|high|medium|low|info
title: short title
cwe: CWE-xx or none
evidence: one or two sentences pointing at the recon or code
:::

Severity must be lowercase. You may put markdown analysis around the blocks.`;
function systemPromptFor(mode) {
	if (mode === "hunt") return `${SHARED_RULES}

Mode: Hunt. You are the lead operator. Plan briefly, interpret recon, rank attack paths, and produce evidence-backed findings. Keep the plan short. Do not invent ports, banners, or response bodies that were not in the recon or the user message.`;
	if (mode === "code") return `${SHARED_RULES}

Mode: Code. Review source, configs, and diffs for exploitable bugs. Quote the vulnerable lines. Suggest a patched snippet. Lab PoCs are allowed; weaponized malware is not.`;
	return `${SHARED_RULES}

Mode: Chat. Answer pentest, CVE, protocol, and methodology questions with precision. When the user wants operations, stay on lab/authorized scope.`;
}
var Route$1 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => handleChat(request) } } });
function sse(event, data) {
	return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}
async function handleChat(request) {
	try {
		assertSameSiteRequest();
	} catch {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}
	const authHeader = request.headers.get("authorization");
	const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : void 0;
	const user = await getSessionUser(bearer);
	if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}
	const content = (body.content ?? "").trim();
	if (!content) return Response.json({ error: "Empty prompt" }, { status: 400 });
	if (content.length > 8e3) return Response.json({ error: "Prompt too long" }, { status: 400 });
	if (!body.engagementId) return Response.json({ error: "Missing engagement" }, { status: 400 });
	const sql = await getSql();
	const owned = await sql`
    select id, title from engagements
    where id = ${body.engagementId} and user_id = ${user.id}
    limit 1
  `;
	if (!owned[0]) return Response.json({ error: "Not found" }, { status: 404 });
	const apiKey = process.env.XAI_API_KEY;
	await sql`
    insert into messages (id, engagement_id, user_id, role, content, kind)
    values (${crypto.randomUUID()}, ${body.engagementId}, ${user.id}, ${"user"}, ${content}, ${"text"})
  `;
	const skill = detectSkill(content);
	const lab = detectLab(content) ?? (skill?.labId ? detectLab(skill.labId) : null);
	let recon = null;
	let reconId = null;
	if (Boolean(lab) && (body.mode === "hunt" || Boolean(skill)) && lab) {
		recon = lab.recon;
		reconId = crypto.randomUUID();
		await sql`
      insert into messages (id, engagement_id, user_id, role, content, kind)
      values (${reconId}, ${body.engagementId}, ${user.id}, ${"assistant"}, ${recon}, ${"recon"})
    `;
	}
	const history = await sql`
    select id, engagement_id, user_id, role, content, kind, created_at
    from messages
    where engagement_id = ${body.engagementId} and user_id = ${user.id}
    order by created_at desc
    limit 16
  `;
	history.reverse();
	const model = getModel(body.modelId);
	const mode = body.mode ?? "chat";
	let extra = "";
	if (mentionsExternalHost(content) && !lab) extra = "\nThe latest user message mentions a host that is not a known lab. Do not produce operational scan or exploit steps. Offer a conceptual answer and a lab alternative.";
	const llmMessages = [{
		role: "system",
		content: systemPromptFor(mode) + extra
	}];
	for (const m of history) {
		if (m.kind === "system") continue;
		if (m.kind === "recon") {
			llmMessages.push({
				role: "user",
				content: `Isolated lab recon dump (not live internet):\n\`\`\`\n${m.content}\n\`\`\``
			});
			continue;
		}
		llmMessages.push({
			role: m.role === "user" ? "user" : "assistant",
			content: m.content
		});
	}
	const encoder = new TextEncoder();
	const stream = new ReadableStream({ async start(controller) {
		const send = (event, data) => {
			controller.enqueue(encoder.encode(sse(event, data)));
		};
		try {
			if (recon && reconId) send("recon", {
				id: reconId,
				content: recon,
				labId: lab?.id ?? null
			});
			const finish = async (full) => {
				const { cleaned, findings } = extractFindings(full);
				const assistantId = crypto.randomUUID();
				const stored = cleaned || full.trim() || "No response from the operator.";
				await sql`
            insert into messages (id, engagement_id, user_id, role, content, kind)
            values (${assistantId}, ${body.engagementId}, ${user.id}, ${"assistant"}, ${stored}, ${"text"})
          `;
				const savedFindings = [];
				for (const f of findings.slice(0, 8)) {
					const fid = crypto.randomUUID();
					await sql`
              insert into findings (id, engagement_id, user_id, severity, title, evidence, cwe)
              values (${fid}, ${body.engagementId}, ${user.id}, ${f.severity}, ${f.title}, ${f.evidence}, ${f.cwe})
            `;
					savedFindings.push({
						id: fid,
						engagement_id: body.engagementId,
						user_id: user.id,
						severity: f.severity,
						title: f.title,
						evidence: f.evidence,
						cwe: f.cwe,
						status: "open",
						created_at: (/* @__PURE__ */ new Date()).toISOString()
					});
				}
				const autoTitle = owned[0].title === "New engagement" ? content.replace(/\s+/g, " ").slice(0, 48) : null;
				if (autoTitle) await sql`
              update engagements
              set title = ${autoTitle}, updated_at = now(), mode = ${mode}, model_id = ${model.id}
              where id = ${body.engagementId} and user_id = ${user.id}
            `;
				else await sql`
              update engagements
              set updated_at = now(), mode = ${mode}, model_id = ${model.id}
              where id = ${body.engagementId} and user_id = ${user.id}
            `;
				send("done", {
					messageId: assistantId,
					content: stored,
					findings: savedFindings,
					title: autoTitle
				});
			};
			const runLocal = async () => {
				const full = nodeAnalyst({
					mode,
					content,
					lab,
					recon
				});
				send("delta", { text: full });
				await finish(full);
			};
			if (!apiKey) {
				await runLocal();
				return;
			}
			const res = await fetch("https://api.x.ai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: "grok-4.5",
					stream: true,
					temperature: model.temperature,
					max_tokens: 1400,
					messages: llmMessages
				})
			});
			if (!res.ok || !res.body) {
				const errText = await res.text().catch(() => "");
				console.error("[chat] xAI error", res.status, errText.slice(0, 400));
				await runLocal();
				return;
			}
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			let full = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const chunks = buffer.split("\n");
				buffer = chunks.pop() ?? "";
				for (const line of chunks) {
					const trimmed = line.trim();
					if (!trimmed.startsWith("data:")) continue;
					const payload = trimmed.slice(5).trim();
					if (payload === "[DONE]") continue;
					try {
						const delta = JSON.parse(payload).choices?.[0]?.delta?.content ?? "";
						if (delta) {
							full += delta;
							send("delta", { text: delta });
						}
					} catch {}
				}
			}
			await finish(full);
		} catch (err) {
			console.error("[chat]", err);
			send("error", { error: "Operator pass failed" });
		} finally {
			controller.close();
		}
	} });
	return new Response(stream, { headers: {
		"Content-Type": "text/event-stream; charset=utf-8",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive"
	} });
}
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	LoginRoute: Route$2.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$4
	}),
	ApiChatRoute: Route$1.update({
		id: "/api/chat",
		path: "/api/chat",
		getParentRoute: () => Route$4
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
export { LAB_TARGETS as a, skillById as i, ELECTRA_SKILL_IDS as n, createSsrRpc as o, KALI_SKILLS as r, router_exports as t };
