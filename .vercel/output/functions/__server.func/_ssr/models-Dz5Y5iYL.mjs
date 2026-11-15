// node_modules/.nitro/vite/services/ssr/assets/models-Dz5Y5iYL.js
var CLOUD_MODELS = [
	{
		id: "gemma4-31b",
		ollamaName: "gemma4:31b",
		label: "Gemma 4 31B",
		role: "Balanced operator",
		plan: "max",
		temperature: .45
	},
	{
		id: "gpt-oss-120b",
		ollamaName: "gpt-oss:120b",
		label: "GPT-OSS 120B",
		role: "Deep reasoning",
		plan: "max",
		temperature: .35
	},
	{
		id: "qwen3-coder",
		ollamaName: "qwen3-coder:cloud",
		label: "Qwen3 Coder",
		role: "Code review",
		plan: "max",
		temperature: .25
	},
	{
		id: "llama4-maverick",
		ollamaName: "llama4:maverick",
		label: "Llama 4 Maverick",
		role: "Fast recon",
		plan: "max",
		temperature: .5
	},
	{
		id: "deepseek-v31",
		ollamaName: "deepseek-v3.1:671b-cloud",
		label: "DeepSeek V3.1",
		role: "Agentic hunt",
		plan: "max",
		temperature: .3
	},
	{
		id: "kimi-k2-ultra",
		ollamaName: "kimi-k2:ultra",
		label: "Kimi K2 Ultra",
		role: "Priority reasoner",
		plan: "ultra",
		temperature: .3
	},
	{
		id: "qwen3-next-ultra",
		ollamaName: "qwen3-next:ultra",
		label: "Qwen3 Next Ultra",
		role: "Long-context hunt",
		plan: "ultra",
		temperature: .28
	},
	{
		id: "deepseek-r1-ultra",
		ollamaName: "deepseek-r1:ultra",
		label: "DeepSeek R1 Ultra",
		role: "Ultra operator",
		plan: "ultra",
		temperature: .2
	}
];
var DEFAULT_MODEL_ID = CLOUD_MODELS[0].id;
function getModel(id) {
	return CLOUD_MODELS.find((m) => m.id === id) ?? CLOUD_MODELS[0];
}
function modelAllowed(id, plan) {
	return getModel(id).plan === "max" || plan === "ultra";
}
var MODES = [
	{
		id: "hunt",
		label: "Hunt",
		hint: "Plan, recon, evidence"
	},
	{
		id: "chat",
		label: "Chat",
		hint: "Security Q&A"
	},
	{
		id: "code",
		label: "Code",
		hint: "Review & PoC"
	}
];
export { modelAllowed as a, getModel as i, DEFAULT_MODEL_ID as n, MODES as r, CLOUD_MODELS as t };
