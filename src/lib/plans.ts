export type PlanId = "max" | "ultra";

export type Plan = {
  id: PlanId;
  label: string;
  node: string;
  fingerprint: string;
  concurrent: number;
  retention: string;
  blurb: string;
};

export const PLANS: Plan[] = [
  {
    id: "max",
    label: "MAX",
    node: "HACKERAI-MAX-7C4E",
    fingerprint: "hx:max:7c:4e:a1:9b:d0:2f:e8:11",
    concurrent: 10,
    retention: "30 days",
    blurb: "Ten concurrent cloud models. Lab recon stays isolated.",
  },
  {
    id: "ultra",
    label: "ULTRA",
    node: "HACKERAI-ULTRA-9A2C",
    fingerprint: "hx:ultra:9a:2c:44:e0:b7:18:03",
    concurrent: 32,
    retention: "90 days",
    blurb: "Priority fleet, 32 slots, Ultra models. Still lab-only.",
  },
];

const KEY = "hackerai.plan";

export function readPlan(): PlanId {
  try {
    return window.localStorage.getItem(KEY) === "ultra" ? "ultra" : "max";
  } catch {
    return "max";
  }
}

export function writePlan(id: PlanId) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
