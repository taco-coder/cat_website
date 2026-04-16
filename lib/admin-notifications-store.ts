type AdminNotification = {
  id: string;
  createdAt: string;
  level: "info" | "warning" | "critical";
  title: string;
  message: string;
};

type GlobalNotifications = typeof globalThis & {
  __adminNotifications?: AdminNotification[];
};

function notificationsStore() {
  const globalStore = globalThis as GlobalNotifications;
  if (!globalStore.__adminNotifications) {
    globalStore.__adminNotifications = [];
  }
  return globalStore.__adminNotifications;
}

export function createNotification(input: Omit<AdminNotification, "id" | "createdAt">) {
  const item: AdminNotification = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  notificationsStore().unshift(item);
  return item;
}

export function listNotifications(limit = 10) {
  return notificationsStore().slice(0, limit);
}
