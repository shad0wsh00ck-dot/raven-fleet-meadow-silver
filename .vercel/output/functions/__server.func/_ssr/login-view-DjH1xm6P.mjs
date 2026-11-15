import { o as __toESM } from "../_runtime.mjs";
import { i as signIn, t as authClient } from "./client-FPuI81k2.mjs";
import { a as GROK_PROVIDERS } from "./verify.server-C4w1ZEsG.mjs";
import { S as useNavigate, qt as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as ShieldCheck, p as Cloud, u as KeyRound } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
// node_modules/.nitro/vite/services/ssr/assets/login-view-DjH1xm6P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var PLANS = [{
	id: "max",
	label: "MAX",
	node: "HACKERAI-MAX-7C4E",
	fingerprint: "hx:max:7c:4e:a1:9b:d0:2f:e8:11",
	concurrent: 10,
	retention: "30 days",
	blurb: "Ten concurrent cloud models. Lab recon stays isolated."
}, {
	id: "ultra",
	label: "ULTRA",
	node: "HACKERAI-ULTRA-9A2C",
	fingerprint: "hx:ultra:9a:2c:44:e0:b7:18:03",
	concurrent: 32,
	retention: "90 days",
	blurb: "Priority fleet, 32 slots, Ultra models. Still lab-only."
}];
var KEY = "hackerai.plan";
function readPlan() {
	try {
		return window.localStorage.getItem(KEY) === "ultra" ? "ultra" : "max";
	} catch {
		return "max";
	}
}
function writePlan(id) {
	try {
		window.localStorage.setItem(KEY, id);
	} catch {}
}
function getPlan(id) {
	return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName$3 = "/app/applet/src/components/ui/button.tsx";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-[var(--ease-smooth-out)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] hover:opacity-90",
			secondary: "bg-elevated text-fg hairline hover:shadow-[var(--shadow-border-hover)]",
			ghost: "bg-transparent text-fg hover:bg-elevated",
			outline: "bg-transparent text-fg hairline hover:bg-elevated",
			danger: "bg-danger text-bg hover:opacity-90"
		},
		size: {
			sm: "h-9 rounded-sm px-3 text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-md px-5 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 34,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/ui/input.tsx";
var Input = (0, import_react.forwardRef)(function Input({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
		ref,
		className: cn("h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg hairline placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-[var(--ease-out)]", "focus:outline-none focus:shadow-[0_0_0_1px_var(--color-accent)]", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 7,
		columnNumber: 7
	}, this);
});
var Textarea = (0, import_react.forwardRef)(function Textarea({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		ref,
		className: cn("min-h-11 w-full resize-none rounded-md bg-elevated px-3 py-3 text-sm text-fg hairline placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-[var(--ease-out)]", "focus:outline-none focus:shadow-[0_0_0_1px_var(--color-accent)]", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 26,
		columnNumber: 5
	}, this);
});
var _jsxFileName$1 = "/app/applet/src/components/logo.tsx";
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-accent", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
				x: "3",
				y: "3",
				width: "26",
				height: "26",
				rx: "6",
				fill: "currentColor",
				opacity: "0.14"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 10,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M10 16h5.2L13 9h6l-2.2 7H22",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "square"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 11,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M10 20h12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "square",
				opacity: "0.7"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 18,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 5,
		columnNumber: 5
	}, this);
}
function Wordmark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mark, { className: "size-8" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 33,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-sm font-semibold tracking-tight",
					children: "HackerAI"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 36,
					columnNumber: 11
				}, this), !compact && /* @__PURE__ */ (void 0)("span", {
					className: "rounded-sm bg-accent-dim px-1.5 py-0.5 font-mono text-2xs font-medium uppercase tracking-widest text-accent",
					children: "Max"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 38,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 35,
				columnNumber: 9
			}, this), !compact && /* @__PURE__ */ (void 0)("p", {
				className: "mt-1 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: "Ollama Cloud"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 44,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 34,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 32,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/login-view.tsx";
function LoginView() {
	const navigate = useNavigate();
	const [emailMode, setEmailMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [planId, setPlanId] = (0, import_react.useState)("ultra");
	const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
	function pickPlan(id) {
		setPlanId(id);
		writePlan(id);
	}
	async function onProvider(providerId) {
		setError(null);
		setBusy(providerId);
		try {
			await signIn(providerId, {
				callbackURL: "/",
				errorCallbackURL: "/login"
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
			setBusy(null);
		}
	}
	async function onEmail(e) {
		e.preventDefault();
		setError(null);
		setBusy("email");
		try {
			if (emailMode === "signup") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: name.trim() || email.split("@")[0] || "Operator"
				});
				if (err) throw new Error(err.message);
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password
				});
				if (err) throw new Error(err.message);
			}
			await authClient.getSession();
			navigate({ to: "/" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Cloud login failed");
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pointer-events-none absolute inset-0 grid-mesh opacity-60" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 64,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "scanlines absolute inset-0 opacity-40" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 65,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "pointer-events-none absolute -left-24 top-24 size-80 rounded-full",
				style: { background: "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 70%)" }
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 66,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "hidden lg:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mark, { className: "size-10" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-lg font-semibold tracking-tight",
								children: "HackerAI"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 79,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-mono text-2xs uppercase tracking-widest text-subtle",
								children: ["Pro Max · ", plan.label]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 80,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-10 max-w-xl text-4xl font-semibold tracking-tight leading-tight",
							children: [
								"Authorize this operator on the ",
								plan.label,
								" fleet."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 85,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-5 max-w-md text-base leading-relaxed text-muted",
							children: "Point it at a lab. It plans the hunt, keeps the evidence, and writes the finding. Cloud models run on Ollama Cloud. Identity stays with you."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "mt-10 grid max-w-md gap-4",
							children: [
								{
									icon: Cloud,
									title: plan.id === "ultra" ? "Ollama Cloud ULTRA" : "Ollama Cloud MAX",
									body: plan.blurb
								},
								{
									icon: ShieldCheck,
									title: "Isolated lab sandbox",
									body: "Recon stays inside authorized *.lab targets."
								},
								{
									icon: KeyRound,
									title: "Evidence trail",
									body: "Every finding points back to a command or a snippet."
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "mt-0.5 grid size-9 place-items-center rounded-sm bg-elevated text-accent hairline",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(item.icon, {
										className: "size-4",
										strokeWidth: 1.75
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 112,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 111,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm font-medium",
									children: item.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 115,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm text-muted",
									children: item.body
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 116,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 114,
									columnNumber: 17
								}, this)]
							}, item.title, true, {
								fileName: _jsxFileName,
								lineNumber: 110,
								columnNumber: 15
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 92,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mx-auto w-full max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-8 flex items-center gap-3 lg:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mark, { className: "size-9" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 125,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-semibold tracking-tight",
								children: "HackerAI Pro Max"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-mono text-2xs uppercase tracking-widest text-subtle",
								children: "Ollama Cloud login"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl bg-surface p-2 hairline",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-xl bg-elevated px-5 py-4 hairline",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "font-mono text-2xs uppercase tracking-widest text-subtle",
									children: "Device authorization"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", {
									className: "mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
											className: "text-subtle",
											children: "Node"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 140,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
											className: "truncate text-fg",
											children: plan.node
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 141,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
											className: "text-subtle",
											children: "Key"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 142,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
											className: "truncate text-accent",
											children: plan.fingerprint
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 143,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", {
											className: "text-subtle",
											children: "Plan"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 144,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", {
											className: "text-fg",
											children: [
												plan.label,
												" · ",
												plan.concurrent,
												" concurrent"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 145,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 139,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "px-5 pb-6 pt-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
										className: "text-lg font-semibold tracking-tight",
										children: "Connect Ollama Cloud"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 152,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-4 grid grid-cols-2 gap-2",
										children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => pickPlan(p.id),
											className: cn("rounded-md px-3 py-2 text-left hairline", planId === p.id ? "bg-accent-dim text-accent" : "text-muted hover:bg-elevated"),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-mono text-2xs uppercase tracking-widest",
												children: p.label
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 164,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "mt-0.5 block text-xs text-fg",
												children: [p.concurrent, " slots"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 165,
												columnNumber: 21
											}, this)]
										}, p.id, true, {
											fileName: _jsxFileName,
											lineNumber: 155,
											columnNumber: 19
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 153,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-sm leading-relaxed text-muted",
										children: "Sign in to authorize this operator. Gate viewers are already connected."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 169,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-5 flex flex-col gap-2",
										children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: "secondary",
											className: "w-full",
											disabled: busy !== null,
											onClick: () => onProvider(p.providerId),
											children: busy === p.providerId ? "Connecting…" : `Continue with ${p.label}`
										}, p.providerId, false, {
											fileName: _jsxFileName,
											lineNumber: 176,
											columnNumber: 21
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 174,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "my-5 flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-px flex-1 bg-border" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 192,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-mono text-2xs uppercase tracking-widest text-subtle",
												children: "Cloud email"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 193,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-px flex-1 bg-border" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 196,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 191,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
										onSubmit: onEmail,
										className: "flex flex-col gap-2",
										children: [
											emailMode === "signup" && /* @__PURE__ */ (void 0)(Input, {
												autoComplete: "name",
												placeholder: "Operator name",
												value: name,
												onChange: (e) => setName(e.target.value)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 201,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												type: "email",
												autoComplete: "email",
												required: true,
												placeholder: "you@lab.mail",
												value: email,
												onChange: (e) => setEmail(e.target.value)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 208,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												type: "password",
												autoComplete: emailMode === "signup" ? "new-password" : "current-password",
												required: true,
												minLength: 8,
												placeholder: "Password · 8+ characters",
												value: password,
												onChange: (e) => setPassword(e.target.value)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 216,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												type: "submit",
												className: "mt-1 w-full",
												disabled: busy !== null,
												children: busy === "email" ? "Authorizing…" : emailMode === "signup" ? `Create ${plan.label} account` : "Authorize node"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 225,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 199,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										className: cn("mt-3 w-full text-center text-sm text-muted transition-opacity duration-150 hover:text-fg"),
										onClick: () => {
											setEmailMode((m) => m === "signin" ? "signup" : "signin");
											setError(null);
										},
										children: emailMode === "signin" ? "Need a cloud account? Create one" : "Already authorized? Sign in"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 234,
										columnNumber: 15
									}, this),
									error && /* @__PURE__ */ (void 0)("p", {
										className: "mt-3 text-sm text-danger",
										role: "alert",
										children: error
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 250,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 134,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-4 px-1 text-center text-xs leading-relaxed text-subtle",
							children: "Authorized testing only. Identity via Google, X, or email. Inference on the Pro Max cloud fleet."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 256,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 74,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 63,
		columnNumber: 5
	}, this);
}
export { Textarea as a, getPlan as c, useCurrentUserState as d, writePlan as f, PLANS as i, readPlan as l, LoginView as n, Wordmark as o, Mark as r, cn as s, Button as t, useCurrentUser as u };
