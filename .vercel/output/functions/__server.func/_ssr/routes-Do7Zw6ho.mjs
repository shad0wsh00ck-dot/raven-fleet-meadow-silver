import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as useRouteContext, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as signOut, r as getBearerToken } from "./client-CGEuTn_7.mjs";
import { t as authMiddleware } from "./middleware-CI58p46Q.mjs";
import { a as modelAllowed, r as MODES, t as CLOUD_MODELS } from "./models-B5dOXbJE.mjs";
import { i as hasGateSessionMarker } from "./verify.server-BE9SUdY4.mjs";
import { a as Shield, c as Plus, d as FileSearch, f as Cpu, i as Terminal, l as Menu, m as ChevronDown, p as Cloud, r as Trash2, s as Send, t as X } from "../_libs/lucide-react.mjs";
import { a as Textarea, c as getPlan, d as useCurrentUserState, f as writePlan, i as PLANS, l as readPlan, n as LoginView, o as Wordmark, r as Mark, s as cn, t as Button, u as useCurrentUser } from "./login-view-CWXfnyT6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as LAB_TARGETS, i as skillById, n as ELECTRA_SKILL_IDS, o as createSsrRpc, r as KALI_SKILLS } from "./router-5v5cmJbt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Do7Zw6ho.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var listEngagements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e6968448a4ebab5dee69996f0f63dc9441313857a8138b9da745999a826a6de2"));
var getEngagement = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("92448a7271a4eb925fc578459bf3144a334216dd082ee32340a8a1d0590a20e1"));
var createEngagement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("99a9f538bafa47d1e9d86e53c7be762b72a78b5733ec7716e46907338a58e726"));
var updateEngagement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("46252f204f798dbe15b8cec685803999f3c4c8923db1d329954ece8ef27db37f"));
var deleteEngagement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("d4f2e70baf7afa679a5e7e69d45ed2fc0c6b7d84de1a602d1281bf3768de9deb"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c09cb40eb67c63ca3046b7cd702b516b03a8536351059a5946cf189aa0fdc90e"));
async function streamChat(input, handlers, signal) {
	const token = getBearerToken();
	const res = await fetch("/api/chat", {
		method: "POST",
		credentials: "include",
		signal,
		headers: {
			"Content-Type": "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		},
		body: JSON.stringify(input)
	});
	if (!res.ok) {
		let msg = `Request failed (${res.status})`;
		try {
			const j = await res.json();
			if (j.error) msg = j.error;
		} catch {}
		handlers.onError?.(msg);
		return;
	}
	if (!res.body) {
		handlers.onError?.("Empty response");
		return;
	}
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let eventName = "message";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";
		for (const line of lines) {
			if (line.startsWith("event:")) {
				eventName = line.slice(6).trim();
				continue;
			}
			if (!line.startsWith("data:")) continue;
			const raw = line.slice(5).trim();
			if (!raw) continue;
			try {
				const data = JSON.parse(raw);
				if (eventName === "delta") handlers.onDelta?.(String(data.text ?? ""));
				else if (eventName === "recon") handlers.onRecon?.(data);
				else if (eventName === "done") handlers.onDone?.(data);
				else if (eventName === "error") handlers.onError?.(String(data.error ?? "Cloud inference failed"));
			} catch {}
			eventName = "message";
		}
	}
}
function inlineFormat(text) {
	return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
		if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-xs bg-elevated px-1 py-0.5 font-mono text-2xs text-accent",
			children: part.slice(1, -1)
		}, i);
		if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-medium text-fg",
			children: part.slice(2, -2)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	});
}
function renderBlock(block, i) {
	if (block.startsWith("```")) {
		const nl = block.indexOf("\n");
		const body = nl === -1 ? "" : block.slice(nl + 1).replace(/```$/, "").trimEnd();
		const lang = nl === -1 ? "" : block.slice(3, nl).trim();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
			className: "overflow-x-auto rounded-md bg-bg px-3 py-3 font-mono text-xs leading-relaxed text-fg hairline",
			children: [lang ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: lang
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: body })]
		}, i);
	}
	if (block.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "text-sm font-semibold tracking-tight",
		children: inlineFormat(block.slice(4))
	}, i);
	if (block.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-base font-semibold tracking-tight",
		children: inlineFormat(block.slice(3))
	}, i);
	if (block.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-base font-semibold tracking-tight",
		children: inlineFormat(block.slice(2))
	}, i);
	if (block.startsWith("- ") || block.startsWith("* ")) {
		const items = block.split("\n").filter(Boolean);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1 pl-4 text-sm leading-relaxed text-fg",
			children: items.map((item, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "list-disc",
				children: inlineFormat(item.replace(/^[-*]\s+/, ""))
			}, j))
		}, i);
	}
	if (/^\d+\.\s/.test(block)) {
		const items = block.split("\n").filter(Boolean);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-1 pl-4 text-sm leading-relaxed text-fg",
			children: items.map((item, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "list-decimal",
				children: inlineFormat(item.replace(/^\d+\.\s+/, ""))
			}, j))
		}, i);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm leading-relaxed text-fg/90",
		children: inlineFormat(block)
	}, i);
}
function Markdown({ text, className }) {
	const blocks = [];
	const fence = /```[\s\S]*?```/g;
	let last = 0;
	let m;
	while (m = fence.exec(text)) {
		if (m.index > last) blocks.push(text.slice(last, m.index).trim());
		blocks.push(m[0]);
		last = m.index + m[0].length;
	}
	if (last < text.length) blocks.push(text.slice(last).trim());
	const expanded = [];
	for (const b of blocks) if (b.startsWith("```")) expanded.push(b);
	else for (const para of b.split(/\n{2,}/)) if (para.trim()) expanded.push(para.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-3", className),
		children: expanded.map((block, i) => renderBlock(block, i))
	});
}
function stripFindingBlocks(text) {
	return text.replace(/:::finding[\s\S]*?(:::|$)/gi, "").trim();
}
function CloudAuthorize({ onLinked }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [planId, setPlanId] = (0, import_react.useState)("ultra");
	const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
	function authorize() {
		setBusy(true);
		writePlan(planId);
		window.setTimeout(() => {
			try {
				window.localStorage.setItem("hackerai.ollama.linked", "1");
			} catch {}
			onLinked();
		}, 700);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 grid-mesh opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines absolute inset-0 opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold tracking-tight",
						children: "HackerAI Pro Max"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-2xs uppercase tracking-widest text-subtle",
						children: ["Ollama Cloud · ", plan.label]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-2 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 p-1",
							children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPlanId(p.id),
								className: cn("rounded-lg px-3 py-3 text-left hairline", planId === p.id ? "bg-accent-dim text-accent" : "bg-elevated text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-2xs uppercase tracking-widest",
									children: p.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-fg",
									children: [p.concurrent, " concurrent"]
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-elevated px-5 py-4 hairline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-2xs uppercase tracking-widest text-subtle",
								children: "Device authorization"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Node"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "truncate text-fg",
										children: plan.node
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Key"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "truncate text-accent",
										children: plan.fingerprint
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "text-fg",
										children: [
											plan.label,
											" · ",
											plan.concurrent,
											" concurrent"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: "Fleet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-fg",
										children: "ollama.com/cloud"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl font-semibold tracking-tight",
									children: "Connect this operator"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: plan.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-6 w-full",
									disabled: busy,
									onClick: authorize,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-4" }), busy ? `Linking ${plan.label} fleet…` : `Authorize ${plan.label} on Ollama Cloud`]
								})
							]
						})
					]
				})]
			})
		]
	});
}
var SEVERITY_CLASS = {
	critical: "text-danger",
	high: "text-danger",
	medium: "text-warn",
	low: "text-accent",
	info: "text-info"
};
function Workspace() {
	const { sessionUser } = useRouteContext({ from: "__root__" });
	const { user, isPending } = useCurrentUserState();
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorConsole, {}) });
	if (isPending && sessionUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceSkeleton, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginView, {});
}
function WorkspaceSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid min-h-dvh place-items-center overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 grid-mesh opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center px-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-2xl font-semibold tracking-tight",
					children: "HackerAI Pro Max"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-2xs uppercase tracking-widest text-accent",
					children: "Ollama Cloud · MAX fleet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-sm text-sm leading-relaxed text-muted",
					children: "Restoring the operator session. Authorized labs, evidence trail, isolated recon."
				})
			]
		})]
	});
}
function OperatorConsole() {
	const [engagements, setEngagements] = (0, import_react.useState)([]);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [findings, setFindings] = (0, import_react.useState)([]);
	const [mode, setMode] = (0, import_react.useState)("hunt");
	const [modelId, setModelId] = (0, import_react.useState)(CLOUD_MODELS[0].id);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [streaming, setStreaming] = (0, import_react.useState)("");
	const [panel, setPanel] = (0, import_react.useState)("none");
	const [modelOpen, setModelOpen] = (0, import_react.useState)(false);
	const [cloudLinked, setCloudLinked] = (0, import_react.useState)(null);
	const [plan, setPlan] = (0, import_react.useState)("max");
	const [upgradeOpen, setUpgradeOpen] = (0, import_react.useState)(false);
	const abortRef = (0, import_react.useRef)(null);
	const scrollerRef = (0, import_react.useRef)(null);
	const textareaRef = (0, import_react.useRef)(null);
	const loadList = (0, import_react.useCallback)(async () => {
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
	const loadOne = (0, import_react.useCallback)(async (id) => {
		const bundle = await getEngagement({ data: id });
		if (!bundle) return;
		setMessages(bundle.messages);
		setFindings(bundle.findings);
		setMode(bundle.engagement.mode);
		setModelId(bundle.engagement.model_id);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			setCloudLinked(window.localStorage.getItem("hackerai.ollama.linked") === "1");
			setPlan(readPlan());
		} catch {
			setCloudLinked(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!cloudLinked) return;
		(async () => {
			const rows = await loadList();
			if (rows[0]) {
				setActiveId(rows[0].id);
				await loadOne(rows[0].id);
			}
		})();
	}, [
		cloudLinked,
		loadList,
		loadOne
	]);
	async function newEngagement(opts) {
		const created = await createEngagement({ data: {
			title: opts?.title,
			mode: opts?.mode ?? "hunt",
			modelId,
			labId: opts?.labId ?? null
		} });
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
	async function selectEngagement(id) {
		setActiveId(id);
		setStreaming("");
		await loadOne(id);
		setPanel("none");
	}
	async function removeEngagement(id) {
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
	async function changeMode(next) {
		setMode(next);
		if (!activeId) return;
		await updateEngagement({ data: {
			id: activeId,
			mode: next
		} });
		setEngagements((prev) => prev.map((e) => e.id === activeId ? {
			...e,
			mode: next
		} : e));
	}
	async function changeModel(id) {
		if (!modelAllowed(id, plan)) {
			setModelOpen(false);
			setUpgradeOpen(true);
			return;
		}
		setModelId(id);
		setModelOpen(false);
		if (!activeId) return;
		await updateEngagement({ data: {
			id: activeId,
			modelId: id
		} });
	}
	function upgrade() {
		writePlan("ultra");
		setPlan("ultra");
		setUpgradeOpen(false);
		toast.success("Ultra fleet linked");
	}
	async function send(text, engagementId, sendMode) {
		const content = (text ?? draft).trim();
		const eid = engagementId ?? activeId;
		if (!content || busy) return;
		let id = eid;
		if (!id) {
			const created = await createEngagement({ data: {
				title: "New engagement",
				mode,
				modelId
			} });
			if (!created) return;
			setEngagements((prev) => [created, ...prev]);
			setActiveId(created.id);
			id = created.id;
			await loadOne(created.id);
		}
		setDraft("");
		setBusy(true);
		setStreaming("");
		const userMsg = {
			id: crypto.randomUUID(),
			engagement_id: id,
			user_id: "me",
			role: "user",
			content,
			kind: "text",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		setMessages((prev) => [...prev, userMsg]);
		abortRef.current?.abort();
		const ac = new AbortController();
		abortRef.current = ac;
		await streamChat({
			engagementId: id,
			content,
			mode: sendMode ?? mode,
			modelId
		}, {
			onRecon: (payload) => {
				setMessages((prev) => [...prev, {
					id: payload.id,
					engagement_id: id,
					user_id: "me",
					role: "assistant",
					content: payload.content,
					kind: "recon",
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				}]);
			},
			onDelta: (t) => setStreaming((s) => s + t),
			onDone: (payload) => {
				setStreaming("");
				setMessages((prev) => [...prev, {
					id: payload.messageId,
					engagement_id: id,
					user_id: "me",
					role: "assistant",
					content: payload.content,
					kind: "text",
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				}]);
				if (payload.findings.length) setFindings((prev) => [...payload.findings, ...prev]);
				if (payload.title) setEngagements((prev) => prev.map((e) => e.id === id ? {
					...e,
					title: payload.title
				} : e));
			},
			onError: (message) => {
				setStreaming("");
				toast.error(message);
				setMessages((prev) => [...prev, {
					id: crypto.randomUUID(),
					engagement_id: id,
					user_id: "me",
					role: "assistant",
					content: message,
					kind: "system",
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				}]);
			}
		}, ac.signal);
		setBusy(false);
	}
	function onKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages, streaming]);
	const model = CLOUD_MODELS.find((m) => m.id === modelId) ?? CLOUD_MODELS[0];
	const activePlan = getPlan(plan);
	if (cloudLinked === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceSkeleton, {});
	if (!cloudLinked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudAuthorize, { onLinked: () => {
		setPlan(readPlan());
		setCloudLinked(true);
	} });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 items-center gap-2 border-b border-border px-3 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden",
						onClick: () => setPanel((p) => p === "sidebar" ? "none" : "sidebar"),
						"aria-label": "Engagements",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { compact: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 hidden items-center gap-1.5 rounded-sm bg-accent-dim px-2 py-1 font-mono text-2xs uppercase tracking-widest text-accent sm:inline-flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent" }),
							activePlan.label,
							" · ",
							activePlan.concurrent
						]
					}),
					plan === "max" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setUpgradeOpen(true),
						className: "inline-flex h-8 items-center rounded-sm bg-elevated px-2 font-mono text-2xs uppercase tracking-widest text-warn hairline",
						children: "Ultra"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative hidden sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setModelOpen((o) => !o),
									className: "flex h-11 items-center gap-2 rounded-md px-3 text-left text-sm hairline hover:bg-elevated",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-4 text-accent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "max-w-40 truncate font-mono text-xs",
											children: model.ollamaName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 text-muted" })
									]
								}), modelOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-0 z-20 mt-1 w-64 rounded-lg bg-surface p-1 hairline",
									children: CLOUD_MODELS.map((m) => {
										const locked = m.plan === "ultra" && plan !== "ultra";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void changeModel(m.id),
											className: cn("flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-elevated", m.id === modelId && "bg-elevated"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-between gap-2 font-mono text-xs",
												children: [m.ollamaName, locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-warn",
													children: "ULTRA"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted",
												children: m.role
											})]
										}, m.id);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden",
								onClick: () => setPanel((p) => p === "rail" ? "none" : "rail"),
								"aria-label": "Findings",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block [&_span]:text-sm [&_button]:text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: cn("z-30 flex w-72 shrink-0 flex-col border-r border-border bg-bg", "max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-xl", panel === "sidebar" ? "max-lg:flex" : "max-lg:hidden", "lg:flex"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-2xs uppercase tracking-widest text-subtle",
									children: "Engagements"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden",
									onClick: () => setPanel("none"),
									"aria-label": "Close",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full",
									size: "md",
									onClick: () => void newEngagement(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New engagement"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-3",
								children: [engagements.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-2 py-4 text-sm text-muted",
									children: "No engagements yet."
								}), engagements.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("group mb-1 flex items-center rounded-md px-2 py-1.5", e.id === activeId ? "bg-elevated" : "hover:bg-elevated/70"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "min-w-0 flex-1 py-2 text-left",
										onClick: () => void selectEngagement(e.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm",
											children: e.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-2xs uppercase tracking-widest text-subtle",
											children: e.mode
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-9 place-items-center rounded-sm text-subtle opacity-0 hover:text-danger group-hover:opacity-100",
										"aria-label": "Delete engagement",
										onClick: () => void removeEngagement(e.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								}, e.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border px-3 py-3 sm:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex min-w-0 flex-1 flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2",
								children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void changeMode(m.id),
									className: cn("h-11 rounded-md px-4 text-sm transition-colors duration-150", mode === m.id ? "bg-elevated text-fg hairline" : "text-muted hover:text-fg"),
									children: [m.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 hidden text-xs text-subtle sm:inline",
										children: m.hint
									})]
								}, m.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								ref: scrollerRef,
								className: "min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8",
								children: messages.length === 0 && !streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
									onLab: (lab) => void newEngagement({
										title: lab.name,
										mode: "hunt",
										labId: lab.id,
										prompt: lab.prompt
									}),
									onSkill: (skill) => void newEngagement({
										title: `${skill.slash} · ${skill.labId === "electra" ? "Electra" : skill.label}`,
										mode: "hunt",
										labId: skill.labId ?? void 0,
										prompt: skill.prompt
									}),
									onPrompt: (p) => {
										setMode("chat");
										setDraft(p);
										textareaRef.current?.focus();
									}
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mx-auto flex max-w-3xl flex-col gap-5",
									children: [
										messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, { message: m }, m.id)),
										busy && !streaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-accent",
											children: "Routing through Ollama Cloud MAX…"
										}),
										streaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-lg bg-surface px-4 py-3 hairline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: stripFindingBlocks(streaming) })
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border px-3 py-3 sm:px-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mx-auto flex max-w-3xl items-end gap-2 rounded-xl bg-surface p-2 hairline",
									onSubmit: (e) => {
										e.preventDefault();
										send();
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										ref: textareaRef,
										rows: 1,
										value: draft,
										onChange: (e) => setDraft(e.target.value),
										onKeyDown,
										placeholder: mode === "hunt" ? "Scope a lab hunt…  Enter to send" : mode === "code" ? "Paste code or ask for a review…" : "Ask about a CVE, protocol, or method…",
										className: "min-h-11 flex-1 bg-transparent shadow-none focus:shadow-none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "icon",
										disabled: busy || !draft.trim(),
										"aria-label": "Send",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-2 max-w-3xl px-1 text-center text-2xs text-subtle",
									children: "Authorized labs and owned systems only. Public hosts are refused for operational work."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: cn("z-30 flex w-80 shrink-0 flex-col border-l border-border bg-bg", "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:shadow-xl", panel === "rail" ? "max-lg:flex" : "max-lg:hidden", "lg:flex"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-2xs uppercase tracking-widest text-subtle",
								children: "Evidence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-md hover:bg-elevated lg:hidden",
								onClick: () => setPanel("none"),
								"aria-label": "Close",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-0 flex-1 overflow-y-auto px-3 pb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-elevated p-3 hairline",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-accent",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-fg",
												children: "Ollama Cloud MAX"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 font-mono text-xs text-muted",
											children: model.ollamaName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs leading-relaxed text-muted",
											children: "10 concurrent · isolated sandbox · evidence attached to this task."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 mt-5 font-mono text-2xs uppercase tracking-widest text-subtle",
									children: "Kali skills"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mb-5 flex flex-col gap-1",
									children: ELECTRA_SKILL_IDS.map((id) => {
										const s = skillById(id);
										if (!s) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-elevated",
											onClick: () => void newEngagement({
												title: `${s.slash} · Electra`,
												mode: "hunt",
												labId: "electra",
												prompt: s.prompt
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs text-accent",
												children: s.slash
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xs text-muted",
												children: s.label
											})]
										}) }, s.id);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 mt-5 font-mono text-2xs uppercase tracking-widest text-subtle",
									children: "Findings"
								}),
								findings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Hunt a lab target and confirmed issues will land here with evidence."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "flex flex-col gap-2",
									children: findings.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-md bg-elevated p-3 hairline",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("font-mono text-2xs uppercase tracking-widest", SEVERITY_CLASS[f.severity] ?? "text-muted"),
													children: f.severity
												}), f.cwe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-2xs text-subtle",
													children: f.cwe
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm font-medium",
												children: f.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs leading-relaxed text-muted",
												children: f.evidence
											})
										]
									}, f.id))
								})
							]
						})]
					}),
					panel !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute inset-0 z-20 bg-bg/60 lg:hidden",
						"aria-label": "Dismiss panel",
						onClick: () => setPanel("none")
					})
				]
			}),
			upgradeOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-end bg-bg/70 p-4 sm:place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl bg-surface p-5 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xs uppercase tracking-widest text-warn",
							children: "Pro Max Ultra"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-xl font-semibold tracking-tight",
							children: "Priority fleet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "32 concurrent slots, 90-day evidence, and Ultra models (Kimi K2, Qwen3 Next, DeepSeek R1). Same lab rules. Nothing leaves authorized targets."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 flex flex-col gap-1 font-mono text-xs text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "kimi-k2:ultra" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "qwen3-next:ultra" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "deepseek-r1:ultra" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: upgrade,
								children: "Link Ultra"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => setUpgradeOpen(false),
								children: "Stay on MAX"
							})]
						})
					]
				})
			})
		]
	});
}
function MessageBubble({ message }) {
	if (message.kind === "recon") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-bg px-4 py-3 hairline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center gap-2 text-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-2xs uppercase tracking-widest",
				children: "Isolated lab recon"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto font-mono text-xs leading-relaxed text-fg/90",
			children: message.content
		})]
	});
	if (message.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ml-8 rounded-lg bg-accent-dim px-4 py-3 sm:ml-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-fg whitespace-pre-wrap",
			children: message.content
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg bg-surface px-4 py-3 hairline",
		children: message.kind === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mt-0.5 size-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: message.content })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: message.content })
	});
}
function EmptyState({ onLab, onSkill, onPrompt }) {
	const electra = LAB_TARGETS.find((l) => l.id === "electra");
	const electraSkills = ELECTRA_SKILL_IDS.map((id) => skillById(id)).filter((s) => Boolean(s));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-2xs uppercase tracking-widest text-accent",
					children: "TestKali · Red Team · Electra"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: "Start a scoped engagement."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-lg text-sm leading-relaxed text-muted",
					children: "Hunt runs isolated recon against known labs. Electra is the AWS cyber range. Third-party production and the public internet are refused."
				})
			] }),
			electra && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onLab(electra),
				className: "rounded-xl bg-surface p-5 text-left hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-2xs uppercase tracking-widest",
							children: "Featured skill"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-xs text-accent",
						children: electra.host
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-lg font-semibold tracking-tight",
						children: electra.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: electra.blurb
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-2xs uppercase tracking-widest text-subtle",
						children: "Start /cloud-recon"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: "Electra chain"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-3",
				children: electraSkills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSkill(skill),
					className: "rounded-lg bg-elevated p-3 text-left hairline hover:shadow-[var(--shadow-border-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-accent",
							children: skill.slash
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: skill.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: skill.blurb
						})
					]
				}, skill.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: "Authorized labs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: LAB_TARGETS.map((lab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onLab(lab),
					className: "rounded-lg bg-surface p-4 text-left hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-accent",
							children: lab.host
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: lab.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: lab.blurb
						})
					]
				}, lab.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: "More Kali modules"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: KALI_SKILLS.filter((s) => !ELECTRA_SKILL_IDS.some((id) => id === s.id)).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onSkill(skill),
					className: "h-11 rounded-md bg-elevated px-3 font-mono text-xs hairline hover:shadow-[var(--shadow-border-hover)]",
					children: skill.slash
				}, skill.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: "Quick prompts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: [
					"Run TestKali Red Team Electra /cloud-recon on electra.lab.",
					"Explain JWT alg=none and how to test it in a lab.",
					"Draft a finding write-up for reflected XSS with remediation."
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onPrompt(p),
					className: "rounded-md bg-elevated px-4 py-3 text-left text-sm text-fg/90 hairline hover:shadow-[var(--shadow-border-hover)]",
					children: p
				}, p))
			})] })
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {});
}
//#endregion
export { Home as component };
