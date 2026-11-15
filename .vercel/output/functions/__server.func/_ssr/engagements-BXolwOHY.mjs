import { t as createServerRpc } from "./createServerRpc-CcwiDFzT.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-BhKN53z1.mjs";
import { t as authMiddleware } from "./middleware-DFtYC0Mo.mjs";
import { n as DEFAULT_MODEL_ID } from "./models-Dz5Y5iYL.mjs";
// node_modules/.nitro/vite/services/ssr/assets/engagements-BXolwOHY.js
function newId() {
	return crypto.randomUUID();
}
var listEngagements_createServerFn_handler = createServerRpc({
	id: "e6968448a4ebab5dee69996f0f63dc9441313857a8138b9da745999a826a6de2",
	name: "listEngagements",
	filename: "src/lib/engagements.ts"
}, (opts) => listEngagements.__executeServer(opts));
var listEngagements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEngagements_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, user_id, title, mode, model_id, lab_id, created_at, updated_at
      from engagements
      where user_id = ${context.userId}
      order by updated_at desc
    `;
});
var getEngagement_createServerFn_handler = createServerRpc({
	id: "92448a7271a4eb925fc578459bf3144a334216dd082ee32340a8a1d0590a20e1",
	name: "getEngagement",
	filename: "src/lib/engagements.ts"
}, (opts) => getEngagement.__executeServer(opts));
var getEngagement = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getEngagement_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const engagement = (await sql`
      select id, user_id, title, mode, model_id, lab_id, created_at, updated_at
      from engagements
      where id = ${id} and user_id = ${context.userId}
      limit 1
    `)[0];
	if (!engagement) return null;
	return {
		engagement,
		messages: await sql`
      select id, engagement_id, user_id, role, content, kind, created_at
      from messages
      where engagement_id = ${id} and user_id = ${context.userId}
      order by created_at asc
    `,
		findings: await sql`
      select id, engagement_id, user_id, severity, title, evidence, cwe, status, created_at
      from findings
      where engagement_id = ${id} and user_id = ${context.userId}
      order by created_at desc
    `
	};
});
var createEngagement_createServerFn_handler = createServerRpc({
	id: "99a9f538bafa47d1e9d86e53c7be762b72a78b5733ec7716e46907338a58e726",
	name: "createEngagement",
	filename: "src/lib/engagements.ts"
}, (opts) => createEngagement.__executeServer(opts));
var createEngagement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createEngagement_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const id = newId();
	const title = (data.title ?? "New engagement").trim() || "New engagement";
	const mode = data.mode ?? "chat";
	const modelId = data.modelId ?? DEFAULT_MODEL_ID;
	const labId = data.labId ?? null;
	await sql`
      insert into engagements (id, user_id, title, mode, model_id, lab_id)
      values (${id}, ${context.userId}, ${title}, ${mode}, ${modelId}, ${labId})
    `;
	await sql`
      insert into messages (id, engagement_id, user_id, role, content, kind)
      values (${newId()}, ${id}, ${context.userId}, ${"assistant"}, ${"Operator online. HackerAI Pro Max is connected to the Ollama Cloud MAX fleet.\n\nThis console is for authorized labs, CTFs, and code you own. Pick a lab target or describe a scoped engagement. Live scanning of third-party systems is refused."}, ${"system"})
    `;
	return (await sql`
      select id, user_id, title, mode, model_id, lab_id, created_at, updated_at
      from engagements where id = ${id} and user_id = ${context.userId}
    `)[0];
});
var updateEngagement_createServerFn_handler = createServerRpc({
	id: "46252f204f798dbe15b8cec685803999f3c4c8923db1d329954ece8ef27db37f",
	name: "updateEngagement",
	filename: "src/lib/engagements.ts"
}, (opts) => updateEngagement.__executeServer(opts));
var updateEngagement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateEngagement_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.title !== void 0) await sql`
        update engagements set title = ${data.title.trim() || "Untitled"}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
	if (data.mode !== void 0) await sql`
        update engagements set mode = ${data.mode}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
	if (data.modelId !== void 0) await sql`
        update engagements set model_id = ${data.modelId}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
	return { ok: true };
});
var deleteEngagement_createServerFn_handler = createServerRpc({
	id: "d4f2e70baf7afa679a5e7e69d45ed2fc0c6b7d84de1a602d1281bf3768de9deb",
	name: "deleteEngagement",
	filename: "src/lib/engagements.ts"
}, (opts) => deleteEngagement.__executeServer(opts));
var deleteEngagement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteEngagement_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await sql`delete from findings where engagement_id = ${id} and user_id = ${context.userId}`;
	await sql`delete from messages where engagement_id = ${id} and user_id = ${context.userId}`;
	await sql`delete from engagements where id = ${id} and user_id = ${context.userId}`;
	return { ok: true };
});
var addFinding_createServerFn_handler = createServerRpc({
	id: "c09cb40eb67c63ca3046b7cd702b516b03a8536351059a5946cf189aa0fdc90e",
	name: "addFinding",
	filename: "src/lib/engagements.ts"
}, (opts) => addFinding.__executeServer(opts));
var addFinding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addFinding_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!(await sql`
      select id from engagements where id = ${data.engagementId} and user_id = ${context.userId}
    `)[0]) return null;
	const id = newId();
	await sql`
      insert into findings (id, engagement_id, user_id, severity, title, evidence, cwe)
      values (${id}, ${data.engagementId}, ${context.userId}, ${data.severity}, ${data.title}, ${data.evidence}, ${data.cwe})
    `;
	return (await sql`
      select id, engagement_id, user_id, severity, title, evidence, cwe, status, created_at
      from findings where id = ${id} and user_id = ${context.userId}
    `)[0] ?? null;
});
export { addFinding_createServerFn_handler, createEngagement_createServerFn_handler, deleteEngagement_createServerFn_handler, getEngagement_createServerFn_handler, listEngagements_createServerFn_handler, updateEngagement_createServerFn_handler };
