export interface IssueMemoryRecord {
  transcriptPath: string;
  proposedIssueTitle: string;
  githubIssueNumber: number | null;
  decision: "create_new_issue" | "update_existing_issue" | "no_action";
}
