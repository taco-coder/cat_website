type AuditEvent = {
  id: string;
  timestamp: string;
  action: "approve" | "reject" | "delete" | "auto_reject" | "auto_queue";
  entityType: "comment";
  entityId: string;
  reason: string;
  actor: string;
};

type GlobalAudit = typeof globalThis & {
  __auditLog?: AuditEvent[];
};

function logStore() {
  const globalStore = globalThis as GlobalAudit;
  if (!globalStore.__auditLog) {
    globalStore.__auditLog = [];
  }
  return globalStore.__auditLog;
}

export function appendAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">) {
  const audit: AuditEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  logStore().unshift(audit);
  return audit;
}

export function listAuditEvents(limit = 30) {
  return logStore().slice(0, limit);
}
