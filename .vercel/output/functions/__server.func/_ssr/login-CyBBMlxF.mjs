import { w as require_jsx_runtime, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useCurrentUserState, n as LoginView } from "./login-view-CWXfnyT6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CyBBMlxF.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg text-sm text-muted",
		children: "Checking operator session…"
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginView, {});
}
//#endregion
export { Login as component };
