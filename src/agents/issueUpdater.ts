import type { ProposedIssue } from "./transcriptParser.js";

export interface IssueUpdateProposal {
  existingIssueNumber: number;
  proposedIssue: ProposedIssue;
  suggestedUpdate: string;
}
