export type IssueStatus = "open" | "in_progress" | "done";

export type CatPost = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  heartCount: number;
};
