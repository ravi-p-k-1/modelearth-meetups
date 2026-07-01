import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { ApprovedIssueForCreation } from "../interfaces/github/approvedIssue.js";
import type { FinalReviewedJson } from "../interfaces/outputs/finalReviewedJson.js";
import { normalizePathForManifest } from "../utils/paths/normalizePath.js";

export async function collectApprovedIssues(
  outputsDir = "outputs",
): Promise<ApprovedIssueForCreation[]> {
  const approvedIssues: ApprovedIssueForCreation[] = [];
  const dateEntries = await readdir(outputsDir, { withFileTypes: true });

  for (const dateEntry of dateEntries) {
    if (!dateEntry.isDirectory()) {
      continue;
    }

    const dateDir = path.join(outputsDir, dateEntry.name);
    const sourceEntries = await readdir(dateDir, { withFileTypes: true });

    for (const sourceEntry of sourceEntries) {
      if (!sourceEntry.isDirectory()) {
        continue;
      }

      const jsonPath = path.join(dateDir, sourceEntry.name, "final-reviewed.json");
      const reviewedJson = await readReviewedJson(jsonPath);

      if (!reviewedJson || reviewedJson.reviewStatus !== "review_complete") {
        continue;
      }

      for (const issue of reviewedJson.issues) {
        if (issue.reviewStatus !== "approved" || issue.githubIssue) {
          continue;
        }

        approvedIssues.push({
          issue,
          source: {
            jsonPath: normalizePathForManifest(jsonPath),
            date: reviewedJson.transcript.date,
            source: reviewedJson.transcript.source,
            agent: reviewedJson.agent,
            model: reviewedJson.model,
          },
        });
      }
    }
  }

  return approvedIssues;
}

async function readReviewedJson(jsonPath: string): Promise<FinalReviewedJson | null> {
  try {
    const rawJson = await readFile(jsonPath, "utf8");
    return JSON.parse(rawJson) as FinalReviewedJson;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}
