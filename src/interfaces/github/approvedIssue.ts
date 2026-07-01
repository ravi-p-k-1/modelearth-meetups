import type { ReviewedIssue } from "../dashboard/reviewData.js";

export interface ApprovedIssueSource {
  jsonPath: string;
  date: string;
  source: string;
  agent: string;
  model: string;
}

export interface ApprovedIssueForCreation {
  issue: ReviewedIssue;
  source: ApprovedIssueSource;
}
