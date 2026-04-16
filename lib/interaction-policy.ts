import type { DecisionAction, InteractionKind, RiskTier } from "@/lib/types";

type InteractionEvent = {
  ts: number;
  actorKey: string;
  ipPrefixHash: string;
  kind: InteractionKind;
  textSignature?: string;
};

type GlobalStore = typeof globalThis & {
  __interactionEvents?: InteractionEvent[];
  __cooldownUntil?: Map<string, number>;
};

type PolicyInput = {
  actorKey: string;
  ipPrefixHash: string;
  kind: InteractionKind;
  text?: string;
};

type PolicyDecision = {
  action: DecisionAction;
  reasonCode: string;
  httpStatus: number;
  risk: { score: number; tier: RiskTier; factors: string[] };
  moderationState?: "pending" | "approved" | "rejected";
  retryAfterMs?: number;
};

const PROFANITY = ["fuck", "shit", "bitch", "asshole", "idiot"];
const SPAM_WORDS = ["buy now", "free money", "click here", "subscribe now"];

function store() {
  return globalThis as GlobalStore;
}

function events() {
  if (!store().__interactionEvents) {
    store().__interactionEvents = [];
  }
  return store().__interactionEvents;
}

function cooldownMap() {
  if (!store().__cooldownUntil) {
    store().__cooldownUntil = new Map<string, number>();
  }
  return store().__cooldownUntil;
}

function trimOld(now: number) {
  const cutoff = now - 60 * 60 * 1000;
  store().__interactionEvents = events().filter((event) => event.ts >= cutoff);
}

function containsLink(text: string) {
  return /(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(text);
}

function containsObfuscatedLink(text: string) {
  return /(hxxp|dot\s+com|\[dot\]|dot\s+net|dot\s+org)/i.test(text);
}

function containsProfanity(text: string) {
  const normalized = text.toLowerCase();
  return PROFANITY.some((word) => normalized.includes(word));
}

function spamScore(text: string) {
  const normalized = text.toLowerCase();
  let score = 0;
  for (const phrase of SPAM_WORDS) {
    if (normalized.includes(phrase)) score += 40;
  }
  if (/(.)\1{6,}/.test(normalized)) score += 20;
  if ((normalized.match(/!/g) ?? []).length > 5) score += 10;
  return score;
}

function evaluateRisk(input: PolicyInput, now: number) {
  const recentActor = events().filter(
    (event) => event.actorKey === input.actorKey && now - event.ts < 60_000,
  );
  const recentPrefix = events().filter(
    (event) => event.ipPrefixHash === input.ipPrefixHash && now - event.ts < 60_000,
  );

  let score = 0;
  const factors: string[] = [];
  if (recentActor.length > 8) {
    score += 35;
    factors.push("actor_velocity_high");
  } else if (recentActor.length > 5) {
    score += 20;
    factors.push("actor_velocity_medium");
  }
  if (recentPrefix.length > 25 && recentActor.length > 2) {
    score += 10;
    factors.push("network_burst_signal");
  }
  if (input.text) {
    if (containsLink(input.text) || containsObfuscatedLink(input.text)) {
      score += 35;
      factors.push("link_like_content");
    }
    if (containsProfanity(input.text)) {
      score += 45;
      factors.push("offensive_language");
    }
    const sScore = spamScore(input.text);
    if (sScore > 0) {
      score += sScore;
      factors.push("spam_pattern");
    }
  }

  const tier: RiskTier =
    score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { score, tier, factors };
}

export function evaluateInteractionPolicy(input: PolicyInput): PolicyDecision {
  const now = Date.now();
  trimOld(now);
  const risk = evaluateRisk(input, now);
  const cooldown = cooldownMap().get(input.actorKey);
  if (cooldown && cooldown > now) {
    return {
      action: "soft_challenge",
      reasonCode: "rate_limited",
      httpStatus: 429,
      risk,
      retryAfterMs: cooldown - now,
    };
  }

  if (input.text && (containsProfanity(input.text) || containsLink(input.text) || containsObfuscatedLink(input.text) || spamScore(input.text) >= 60)) {
    events().push({
      ts: now,
      actorKey: input.actorKey,
      ipPrefixHash: input.ipPrefixHash,
      kind: input.kind,
      textSignature: input.text.toLowerCase().slice(0, 120),
    });
    return {
      action: "reject",
      reasonCode: "harmful_content",
      httpStatus: 403,
      risk,
      moderationState: "rejected",
    };
  }

  const actorRecent = events().filter(
    (event) => event.actorKey === input.actorKey && now - event.ts < 45_000,
  ).length;
  const weightedActorLoad = actorRecent + (input.kind === "comment" ? 2 : 0);
  if (weightedActorLoad > 7) {
    const until = now + 30_000;
    cooldownMap().set(input.actorKey, until);
    return {
      action: "soft_challenge",
      reasonCode: "cooldown_active",
      httpStatus: 429,
      risk,
      retryAfterMs: 30_000,
    };
  }

  events().push({
    ts: now,
    actorKey: input.actorKey,
    ipPrefixHash: input.ipPrefixHash,
    kind: input.kind,
    textSignature: input.text?.toLowerCase().slice(0, 120),
  });

  if (input.kind === "comment" && risk.tier === "high") {
    return {
      action: "queue",
      reasonCode: "needs_review",
      httpStatus: 202,
      risk,
      moderationState: "pending",
    };
  }

  return {
    action: "allow",
    reasonCode: "ok",
    httpStatus: 200,
    risk,
    moderationState: input.kind === "comment" ? "approved" : undefined,
  };
}
