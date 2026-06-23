export interface UpdateIssueInput {
  issueNumber: number;
  title?: string;
  body?: string;
  assignees?: string[];
  labels?: string[];
}
