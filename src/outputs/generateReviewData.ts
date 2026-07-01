import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  IssueReviewStatus,
  ReviewData,
  ReviewDataSource,
  TranscriptReviewStatus,
} from "../interfaces/dashboard/reviewData.js";
import type { RawFinalReviewedJson } from "../interfaces/outputs/finalReviewedJson.js";
import { normalizePathForManifest } from "../utils/paths/normalizePath.js";

const outputsDir = "outputs";
const dashboardDataPath = path.join("dashboard", "review-ui", "review-data.json");

const reviewSources = await collectReviewDataSources(outputsDir);
const reviewData: ReviewData = {
  generatedAt: new Date().toISOString(),
  sources: reviewSources,
};

await mkdir(path.dirname(dashboardDataPath), { recursive: true });
await writeFile(dashboardDataPath, `${JSON.stringify(reviewData, null, 2)}\n`);

console.log(`Generated ${dashboardDataPath} from ${reviewSources.length} review source(s).`);

async function collectReviewDataSources(baseOutputsDir: string): Promise<ReviewDataSource[]> {
  const sources: ReviewDataSource[] = [];
  const dateEntries = await readdir(baseOutputsDir, { withFileTypes: true });

  for (const dateEntry of dateEntries) {
    if (!dateEntry.isDirectory()) {
      continue;
    }

    const date = dateEntry.name;
    const dateDir = path.join(baseOutputsDir, date);
    const sourceEntries = await readdir(dateDir, { withFileTypes: true });

    for (const sourceEntry of sourceEntries) {
      if (!sourceEntry.isDirectory()) {
        continue;
      }

      const source = sourceEntry.name;
      const jsonPath = path.join(dateDir, source, "final-reviewed.json");
      const reviewSource = await readReviewSource(jsonPath);

      if (!reviewSource) {
        continue;
      }

      sources.push(reviewSource);
    }
  }

  return sources;
}

async function readReviewSource(jsonPath: string): Promise<ReviewDataSource | null> {
  try {
    const rawJson = await readFile(jsonPath, "utf8");
    const parsed = JSON.parse(rawJson) as RawFinalReviewedJson;

    return {
      date: parsed.transcript.date,
      source: parsed.transcript.source,
      transcriptPath: normalizePathForManifest(parsed.transcript.transcriptPath),
      jsonPath: normalizePathForManifest(jsonPath),
      agent: parsed.agent,
      model: parsed.model,
      reviewStatus: normalizeTranscriptStatus(parsed.reviewStatus),
      issues: parsed.issues.map((issue) => ({
        ...issue,
        reviewStatus: normalizeIssueStatus(issue.reviewStatus),
      })),
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function normalizeTranscriptStatus(status: string | undefined): TranscriptReviewStatus {
  return status === "review_complete" ? "review_complete" : "in_review";
}

function normalizeIssueStatus(status: string | undefined): IssueReviewStatus {
  if (status === "approved" || status === "rejected") {
    return status;
  }

  return "pending_review";
}
