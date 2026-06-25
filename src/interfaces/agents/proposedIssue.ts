import type { AgentRun } from "./agentRun.js";

// Structured representation of a GitHub Issue proposed from a transcript.
export interface ProposedIssue {
  id: string;
  title: string;
  description: string;
  assignee: string | null;
  labels: string[];
  priority: "low" | "medium" | "high" | null;
  deadline: string | null;
  meetingReference: string;
  similarExistingIssue: string | null;
  recommendedAction: "create_new_issue" | "update_existing_issue" | "no_action";
  reviewStatus: "pending_review" | "approved" | "rejected";
}

// Complete issue extraction result for one transcript and one agent run.
export interface TranscriptAnalysis extends AgentRun {
  sourceTranscript: string;
  processedAt: string;
  proposedIssues: ProposedIssue[];
}
