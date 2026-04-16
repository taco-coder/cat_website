import type { IssueStatus } from "@/lib/types";

export type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  createdAt: string;
};

const seed: Issue[] = [
  {
    id: "1",
    title: "Learn Server vs Client Components",
    description:
      "Default to Server Components; add 'use client' only for interactivity.",
    status: "in_progress",
    createdAt: new Date("2026-04-01T12:00:00.000Z").toISOString(),
  },
  {
    id: "2",
    title: "Practice URL-driven filters",
    description: "Prefer searchParams over global state when filters should be shareable.",
    status: "open",
    createdAt: new Date("2026-04-02T09:30:00.000Z").toISOString(),
  },
  {
    id: "3",
    title: "Ship a form with Zod + server actions",
    description: "Validate on the server; echo field errors to the client.",
    status: "done",
    createdAt: new Date("2026-04-03T16:45:00.000Z").toISOString(),
  },
];

const globalForStore = globalThis as typeof globalThis & {
  __issueStore?: Issue[];
};

function getStore(): Issue[] {
  if (!globalForStore.__issueStore) {
    globalForStore.__issueStore = structuredClone(seed);
  }
  return globalForStore.__issueStore;
}

export function listIssues(): Issue[] {
  return [...getStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getIssue(id: string): Issue | undefined {
  return getStore().find((i) => i.id === id);
}

export function createIssue(data: Omit<Issue, "id" | "createdAt">): Issue {
  const issue: Issue = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  getStore().unshift(issue);
  return issue;
}

export function updateIssue(
  id: string,
  data: Omit<Issue, "id" | "createdAt">,
): Issue | undefined {
  const store = getStore();
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  const prev = store[idx];
  const next: Issue = {
    ...prev,
    ...data,
  };
  store[idx] = next;
  return next;
}
