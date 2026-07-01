import type { GitHubConfig } from "../interfaces/github/githubConfig.js";
import type { GitHubIssueMetadata } from "../interfaces/github/githubIssueMetadata.js";
import type {
  CreatedIssueResponse,
  ProjectLookupResponse,
} from "../interfaces/github/githubApi.js";
import type { ReviewedIssue } from "../interfaces/dashboard/reviewData.js";
import { graphQlRequest } from "../utils/github/graphql.js";
import { getGitHubHeaders } from "../utils/github/headers.js";
import { buildIssueBody } from "../utils/github/issueBody.js";

export async function createGitHubIssue(
  config: GitHubConfig,
  issue: ReviewedIssue,
): Promise<GitHubIssueMetadata> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues`,
    {
      method: "POST",
      headers: getGitHubHeaders(config.token),
      body: JSON.stringify({
        title: issue.title,
        body: buildIssueBody(issue),
        labels: issue.labels,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub issue creation failed: ${response.status} ${await response.text()}`);
  }

  const createdIssue = (await response.json()) as CreatedIssueResponse;

  return {
    number: createdIssue.number,
    url: createdIssue.html_url,
    nodeId: createdIssue.node_id,
    createdAt: new Date().toISOString(),
  };
}

export async function getProjectNodeId(
  token: string,
  ownerType: "orgs" | "users",
  owner: string,
  projectNumber: number,
): Promise<string> {
  const rootField = ownerType === "orgs" ? "organization" : "user";
  const query = `
    query($owner: String!, $projectNumber: Int!) {
      ${rootField}(login: $owner) {
        projectV2(number: $projectNumber) {
          id
        }
      }
    }
  `;

  let response: ProjectLookupResponse;

  try {
    response = await graphQlRequest<ProjectLookupResponse>(token, query, {
      owner,
      projectNumber,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Resource not accessible by personal access token")
    ) {
      throw new Error(
        [
          `GitHub token cannot access project ${ownerType}/${owner}/projects/${projectNumber}.`,
          "Update GITHUB_TOKEN so it has access to the GitHub Project.",
          "For fine-grained tokens, grant Organization permissions -> Projects: Read and write.",
          "Also confirm the token owner can access the org/project and has completed SSO authorization if required.",
        ].join(" "),
      );
    }

    throw error;
  }

  const projectId = response[rootField]?.projectV2?.id;

  if (!projectId) {
    throw new Error(`Could not find GitHub project ${ownerType}/${owner}/projects/${projectNumber}`);
  }

  return projectId;
}

export async function addIssueToProject(
  token: string,
  projectId: string,
  issueNodeId: string,
): Promise<void> {
  const mutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
        item {
          id
        }
      }
    }
  `;

  await graphQlRequest(token, mutation, {
    projectId,
    contentId: issueNodeId,
  });
}
