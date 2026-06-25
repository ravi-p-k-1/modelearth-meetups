import type { ProposedIssue } from "../agents/proposedIssue.js";

export type TranscriptReviewStatus = "in_review" | "review_complete";

export type IssueReviewStatus = "pending_review" | "approved" | "rejected";

export interface ReviewedIssue extends Omit<ProposedIssue, "reviewStatus"> {
  reviewStatus: IssueReviewStatus;
}

export interface ReviewDataSource {
  date: string;
  source: string;
  transcriptPath: string;
  jsonPath: string;
  agent: string;
  model: string;
  reviewStatus: TranscriptReviewStatus;
  issues: ReviewedIssue[];
}

export interface ReviewData {
  generatedAt: string;
  sources: ReviewDataSource[];
}
