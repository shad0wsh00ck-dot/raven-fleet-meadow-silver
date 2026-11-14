import type { PlanId } from "./plans";

export type OperatorMode = "hunt" | "chat" | "code";

export type CloudModel = {
  id: string;
  ollamaName: string;
  label: string;
  role: string;
  plan: PlanId;
  temperature: number;
};

export const CLOUD_MODELS: CloudModel[] = [
  {
    id: "gemma4-31b",
    ollamaName: "gemma4:31b",
    label: "Gemma 4 31B",
    role: "Balanced operator",
    plan: "max",
    temperature: 0.45,
  },
  {
    id: "gpt-oss-120b",
    ollamaName: "gpt-oss:120b",
    label: "GPT-OSS 120B",
    role: "Deep reasoning",
    plan: "max",
    temperature: 0.35,
  },
  {
    id: "qwen3-coder",
    ollamaName: "qwen3-coder:cloud",
    label: "Qwen3 Coder",
    role: "Code review",
    plan: "max",
    temperature: 0.25,
  },
  {
    id: "llama4-maverick",
    ollamaName: "llama4:maverick",
    label: "Llama 4 Maverick",
    role: "Fast recon",
    plan: "max",
    temperature: 0.5,
  },
  {
    id: "deepseek-v31",
    ollamaName: "deepseek-v3.1:671b-cloud",
    label: "DeepSeek V3.1",
    role: "Agentic hunt",
    plan: "max",
    temperature: 0.3,
  },
  {
    id: "kimi-k2-ultra",
    ollamaName: "kimi-k2:ultra",
    label: "Kimi K2 Ultra",
    role: "Priority reasoner",
    plan: "ultra",
    temperature: 0.3,
  },
  {
    id: "qwen3-next-ultra",
    ollamaName: "qwen3-next:ultra",
    label: "Qwen3 Next Ultra",
    role: "Long-context hunt",
    plan: "ultra",
    temperature: 0.28,
  },
  {
    id: "deepseek-r1-ultra",
    ollamaName: "deepseek-r1:ultra",
    label: "DeepSeek R1 Ultra",
    role: "Ultra operator",
    plan: "ultra",
    temperature: 0.2,
  },
];

export const DEFAULT_MODEL_ID = CLOUD_MODELS[0].id;

export function getModel(id: string): CloudModel {
  return CLOUD_MODELS.find((m) => m.id === id) ?? CLOUD_MODELS[0];
}

export function modelAllowed(id: string, plan: PlanId): boolean {
  const model = getModel(id);
  return model.plan === "max" || plan === "ultra";
}

export const MODES: { id: OperatorMode; label: string; hint: string }[] = [
  { id: "hunt", label: "Hunt", hint: "Plan, recon, evidence" },
  { id: "chat", label: "Chat", hint: "Security Q&A" },
  { id: "code", label: "Code", hint: "Review & PoC" },
];
