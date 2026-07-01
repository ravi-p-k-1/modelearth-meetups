import { readFile, writeFile } from "node:fs/promises";

import type {
  GitHubIssueMetadata,
  GitHubProjectMetadata,
} from "../interfaces/github/githubIssueMetadata.js";
import { normalizePathForManifest } from "../utils/paths/normalizePath.js";

interface ReviewJsonWithIssues {
  issues: Array<{
    id: string;
    githubIssue?: GitHubIssueMetadata;
    githubProject?: GitHubProjectMetadata;
  }>;
}

export async function markIssueCreated(
  jsonPath: string,
  issueId: string,
  githubIssue: GitHubIssueMetadata,
  githubProject: GitHubProjectMetadata,
): Promise<void> {
  const rawJson = await readFile(jsonPath, "utf8");
  const parsed = JSON.parse(rawJson) as ReviewJsonWithIssues;
  const issue = parsed.issues.find((candidate) => candidate.id === issueId);

  if (!issue) {
    throw new Error(`Could not find issue ${issueId} in ${jsonPath}`);
  }

  issue.githubIssue = githubIssue;
  issue.githubProject = {
    ...githubProject,
    url: normalizePathForManifest(githubProject.url),
  };

  await writeFile(jsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
}
