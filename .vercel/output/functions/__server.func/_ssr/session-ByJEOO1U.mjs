import { t as createServerRpc } from "./createServerRpc-CcwiDFzT.mjs";
import { r as createServerFn } from "./ssr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/session-ByJEOO1U.js
var fetchSessionUser_createServerFn_handler = createServerRpc({
	id: "84e93aa9a4240c380045ee2a2b03d040f71423f1e8e84c8eba0a02080539bf41",
	name: "fetchSessionUser",
	filename: "src/lib/session.ts"
}, (opts) => fetchSessionUser.__executeServer(opts));
var fetchSessionUser = createServerFn({ method: "GET" }).handler(fetchSessionUser_createServerFn_handler, async () => {
	const { getSessionUser } = await import("./verify.server-C4w1ZEsG.mjs").then((n) => n.n);
	const u = await getSessionUser();
	return u ? {
		id: u.id,
		email: u.email
	} : null;
});
export { fetchSessionUser_createServerFn_handler };
