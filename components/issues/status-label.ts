import type { IssueStatus } from "@/lib/types";

export function statusLabel(status: IssueStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}
