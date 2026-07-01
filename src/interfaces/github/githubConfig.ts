export interface GitHubConfig {
  owner: string;
  repo: string;
  projectUrl: string;
  token: string;
}

export interface ParsedGitHubProjectUrl {
  ownerType: "orgs" | "users";
  owner: string;
  projectNumber: number;
}
