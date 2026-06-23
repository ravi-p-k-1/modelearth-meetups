import type { ProposedIssue } from "./transcriptParser.js";

export interface ExistingIssueMatch {
  issueNumber: number;
  title: string;
  url: string;
  confidence: "low" | "medium" | "high";
}

export interface IssueMatchResult {
  proposedIssue: ProposedIssue;
  existingIssue: ExistingIssueMatch | null;
}
