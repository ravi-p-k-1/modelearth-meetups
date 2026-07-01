import type { GraphQlResponse } from "../../interfaces/github/githubApi.js";
import { getGitHubHeaders } from "./headers.js";

export async function graphQlRequest<T>(
  token: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: getGitHubHeaders(token),
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.status} ${await response.text()}`);
  }

  const payload = (await response.json()) as GraphQlResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  if (!payload.data) {
    throw new Error("GitHub GraphQL response did not include data.");
  }

  return payload.data;
}
