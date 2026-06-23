export interface ProposedIssue {
  title: string;
  description: string;
  assignee: string | null;
  labels: string[];
  meetingReference: string;
  recommendedAction: "create_new_issue" | "update_existing_issue" | "no_action";
}

export interface TranscriptAnalysis {
  sourceTranscript: string;
  proposedIssues: ProposedIssue[];
}
