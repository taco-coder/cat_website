const ADMIN_SESSION_COOKIE = "admin_session";
const MAGIC_TOKEN_TTL_MS = 1000 * 60 * 10;

const globalForAdminAuth = globalThis as typeof globalThis & {
  __magicTokens?: Map<string, number>;
};

function getTokenStore() {
  if (!globalForAdminAuth.__magicTokens) {
    globalForAdminAuth.__magicTokens = new Map<string, number>();
  }
  return globalForAdminAuth.__magicTokens;
}

function getSecretPhrase() {
  return process.env.ADMIN_SECRET_PHRASE ?? "pixel-admin";
}

export function isValidSecretPhrase(candidate: string) {
  return candidate.trim().length > 0 && candidate === getSecretPhrase();
}

export function issueMagicToken() {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + MAGIC_TOKEN_TTL_MS;
  getTokenStore().set(token, expiresAt);
  return token;
}

export function consumeMagicToken(token: string) {
  const store = getTokenStore();
  const expiresAt = store.get(token);
  if (!expiresAt) return false;
  store.delete(token);
  return expiresAt > Date.now();
}

export function getAdminSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}
