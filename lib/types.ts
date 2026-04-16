export type IssueStatus = "open" | "in_progress" | "done";

export type CatPost = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  heartCount: number;
};

export type ModerationState = "pending" | "approved" | "rejected" | "deleted";

export type CatComment = {
  id: string;
  postId: string;
  body: string;
  createdAt: string;
  status: ModerationState;
  moderationReason?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  actorKey: string;
  safetySignals: {
    hasProfanity: boolean;
    hasLink: boolean;
    hasObfuscatedLink: boolean;
    spamScore: number;
  };
};

export type InteractionKind = "like" | "comment";
export type RiskTier = "low" | "medium" | "high" | "critical";
export type DecisionAction = "allow" | "soft_challenge" | "queue" | "reject";
