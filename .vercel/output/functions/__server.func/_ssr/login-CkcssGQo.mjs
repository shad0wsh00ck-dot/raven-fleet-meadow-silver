import { d as useCurrentUserState, n as LoginView } from "./login-view-DjH1xm6P.mjs";
import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/login-CkcssGQo.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/login.tsx?tsr-split=component";
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid min-h-dvh place-items-center bg-bg text-sm text-muted",
		children: "Checking operator session…"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 10,
		columnNumber: 12
	}, this);
	if (user) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigate, { to: "/" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 14,
		columnNumber: 20
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoginView, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 15,
		columnNumber: 10
	}, this);
}
export { Login as component };
