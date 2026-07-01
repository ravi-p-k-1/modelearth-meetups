export interface GitHubIssueMetadata {
  number: number;
  url: string;
  nodeId: string;
  createdAt: string;
}

export interface GitHubProjectMetadata {
  url: string;
  linked: boolean;
  linkedAt: string | null;
}
