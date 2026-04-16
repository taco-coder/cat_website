import type { NextRequest } from "next/server";

export const ACTOR_COOKIE = "anon_actor_id";

export function hashStable(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0).toString(16);
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "0.0.0.0";
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
}

function ipPrefix(ip: string) {
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 4).join(":");
  }
  return ip.split(".").slice(0, 3).join(".");
}

export function getActorContext(request: NextRequest) {
  const actorId = request.cookies.get(ACTOR_COOKIE)?.value ?? crypto.randomUUID();
  const hasExistingCookie = request.cookies.has(ACTOR_COOKIE);
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") ?? "unknown";
  const ipHash = hashStable(`ip:${ip}`);
  const ipPrefixHash = hashStable(`ipp:${ipPrefix(ip)}`);
  const actorKey = hashStable(`actor:${actorId}:ip:${ipHash}`);

  return {
    actorId,
    hasExistingCookie,
    actorKey,
    uaHash: hashStable(`ua:${ua}`),
    ipHash,
    ipPrefixHash,
  };
}
