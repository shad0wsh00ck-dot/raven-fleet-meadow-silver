import type { OperatorMode } from "./models";
import type { Severity } from "./findings";

export type Engagement = {
  id: string;
  user_id: string;
  title: string;
  mode: OperatorMode;
  model_id: string;
  lab_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  engagement_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  kind: "text" | "recon" | "system";
  created_at: string;
};

export type Finding = {
  id: string;
  engagement_id: string;
  user_id: string;
  severity: Severity;
  title: string;
  evidence: string;
  cwe: string | null;
  status: string;
  created_at: string;
};

export type EngagementBundle = {
  engagement: Engagement;
  messages: ChatMessage[];
  findings: Finding[];
};
