import { z } from "zod";

export const issueStatusSchema = z.enum(["open", "in_progress", "done"]);

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  status: issueStatusSchema,
});

export const updateIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  status: issueStatusSchema,
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
