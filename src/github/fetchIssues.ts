export interface GitHubIssueSummary {
  number: number;
  title: string;
  url: string;
  labels: string[];
  assignees: string[];
  state: "open" | "closed";
}
