import { describe, expect, it } from "vitest";
import { statusLabel } from "@/components/issues/status-label";

describe("statusLabel", () => {
  it("maps known statuses to labels", () => {
    expect(statusLabel("open")).toBe("Open");
    expect(statusLabel("in_progress")).toBe("In progress");
    expect(statusLabel("done")).toBe("Done");
  });
});
