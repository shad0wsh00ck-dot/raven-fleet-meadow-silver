import { o as __toESM } from "../_runtime.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signIn, t as authClient } from "./client-CGEuTn_7.mjs";
import { a as GROK_PROVIDERS } from "./verify.server-BE9SUdY4.mjs";
import { o as ShieldCheck, p as Cloud, u as KeyRound } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-view-CWXfnyT6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Input = (0, import_react.forwardRef)(function Input({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref,
		className: cn("h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg hairline placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-[var(--ease-out)]", "focus:outline-none focus:shadow-[0_0_0_1px_var(--color-accent)]", className),
		...props
	});
});
var Textarea = (0, import_react.forwardRef)(function Textarea({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref,
		className: cn("min-h-11 w-full resize-none rounded-md bg-elevated px-3 py-3 text-sm text-fg hairline placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-[var(--ease-out)]", "focus:outline-none focus:shadow-[0_0_0_1px_var(--color-accent)]", className),
		...props
	});
});
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-accent", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "3",
				width: "26",
				height: "26",
				rx: "6",
				fill: "currentColor",
				opacity: "0.14"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 16h5.2L13 9h6l-2.2 7H22",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "square"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 20h12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "square",
				opacity: "0.7"
			})
		]
	});
}
function Wordmark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold tracking-tight",
					children: "HackerAI"
				}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-sm bg-accent-dim px-1.5 py-0.5 font-mono text-2xs font-medium uppercase tracking-widest text-accent",
					children: "Max"
				})]
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-2xs uppercase tracking-widest text-subtle",
				children: "Ollama Cloud"
			})]
		})]
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 grid-mesh opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines absolute inset-0 opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -left-24 top-24 size-80 rounded-full",
				style: { background: "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "hidden lg:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-semibold tracking-tight",
								children: "HackerAI"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-2xs uppercase tracking-widest text-subtle",
								children: ["Pro Max · ", plan.label]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-10 max-w-xl text-4xl font-semibold tracking-tight leading-tight",
							children: [
								"Authorize this operator on the ",
								plan.label,
								" fleet."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-md text-base leading-relaxed text-muted",
							children: "Point it at a lab. It plans the hunt, keeps the evidence, and writes the finding. Cloud models run on Ollama Cloud. Identity stays with you."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
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
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 grid size-9 place-items-center rounded-sm bg-elevated text-accent hairline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
										className: "size-4",
										strokeWidth: 1.75
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: item.body
								})] })]
							}, item.title))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto w-full max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8 flex items-center gap-3 lg:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold tracking-tight",
								children: "HackerAI Pro Max"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-2xs uppercase tracking-widest text-subtle",
								children: "Ollama Cloud login"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-surface p-2 hairline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 pb-6 pt-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-semibold tracking-tight",
										children: "Connect Ollama Cloud"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 grid grid-cols-2 gap-2",
										children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => pickPlan(p.id),
											className: cn("rounded-md px-3 py-2 text-left hairline", planId === p.id ? "bg-accent-dim text-accent" : "text-muted hover:bg-elevated"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-2xs uppercase tracking-widest",
												children: p.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-0.5 block text-xs text-fg",
												children: [p.concurrent, " slots"]
											})]
										}, p.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-muted",
										children: "Sign in to authorize this operator. Gate viewers are already connected."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-5 flex flex-col gap-2",
										children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											className: "w-full",
											disabled: busy !== null,
											onClick: () => onProvider(p.providerId),
											children: busy === p.providerId ? "Connecting…" : `Continue with ${p.label}`
										}, p.providerId))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "my-5 flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-2xs uppercase tracking-widest text-subtle",
												children: "Cloud email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: onEmail,
										className: "flex flex-col gap-2",
										children: [
											emailMode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												autoComplete: "name",
												placeholder: "Operator name",
												value: name,
												onChange: (e) => setName(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "email",
												autoComplete: "email",
												required: true,
												placeholder: "you@lab.mail",
												value: email,
												onChange: (e) => setEmail(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												autoComplete: emailMode === "signup" ? "new-password" : "current-password",
												required: true,
												minLength: 8,
												placeholder: "Password · 8+ characters",
												value: password,
												onChange: (e) => setPassword(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "submit",
												className: "mt-1 w-full",
												disabled: busy !== null,
												children: busy === "email" ? "Authorizing…" : emailMode === "signup" ? `Create ${plan.label} account` : "Authorize node"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: cn("mt-3 w-full text-center text-sm text-muted transition-opacity duration-150 hover:text-fg"),
										onClick: () => {
											setEmailMode((m) => m === "signin" ? "signup" : "signin");
											setError(null);
										},
										children: emailMode === "signin" ? "Need a cloud account? Create one" : "Already authorized? Sign in"
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-danger",
										role: "alert",
										children: error
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 px-1 text-center text-xs leading-relaxed text-subtle",
							children: "Authorized testing only. Identity via Google, X, or email. Inference on the Pro Max cloud fleet."
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Textarea as a, getPlan as c, useCurrentUserState as d, writePlan as f, PLANS as i, readPlan as l, LoginView as n, Wordmark as o, Mark as r, cn as s, Button as t, useCurrentUser as u };
