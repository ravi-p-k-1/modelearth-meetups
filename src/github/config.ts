import type {
  GitHubConfig,
  ParsedGitHubProjectUrl,
} from "../interfaces/github/githubConfig.js";
import { loadEnvFile } from "../utils/env/loadEnv.js";

export async function loadGitHubConfig(): Promise<GitHubConfig> {
  const envFile = await loadEnvFile();
  const env = { ...envFile, ...process.env };

  const config = {
    owner: env.GITHUB_OWNER ?? "",
    repo: env.GITHUB_REPO ?? "",
    projectUrl: env.GITHUB_PROJECT ?? "",
    token: env.GITHUB_TOKEN ?? "",
  };

  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing GitHub config values: ${missingKeys.join(", ")}`);
  }

  return config;
}

export function parseGitHubProjectUrl(projectUrl: string): ParsedGitHubProjectUrl {
  const parsedUrl = new URL(projectUrl);
  const [, ownerType, owner, projectsSegment, projectNumber] = parsedUrl.pathname.split("/");

  if (
    parsedUrl.hostname !== "github.com" ||
    (ownerType !== "orgs" && ownerType !== "users") ||
    !owner ||
    projectsSegment !== "projects" ||
    !projectNumber
  ) {
    throw new Error(`Invalid GitHub project URL: ${projectUrl}`);
  }

  return {
    ownerType,
    owner,
    projectNumber: Number(projectNumber),
  };
}
