import { readFile, writeFile } from "node:fs/promises";

import type { ProcessedManifest } from "../interfaces/processing/processedManifest.js";
import { normalizePathForManifest } from "../utils/paths/normalizePath.js";

// The manifest is the source of truth for which transcript folders have already
// produced agent output files.
export function isTranscriptProcessed(
  manifest: ProcessedManifest,
  transcriptPath: string,
): boolean {
  const normalizedTranscriptPath = normalizePathForManifest(transcriptPath);

  return manifest.processed.some(
    (record) => normalizePathForManifest(record.transcriptPath) === normalizedTranscriptPath,
  );
}

// Missing manifests are treated as an empty first run.
export async function readManifest(manifestPath: string): Promise<ProcessedManifest> {
  try {
    const rawManifest = await readFile(manifestPath, "utf8");
    return JSON.parse(rawManifest) as ProcessedManifest;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { processed: [] };
    }

    throw error;
  }
}

// Keep the manifest human-readable because it is part of the review workflow.
export async function writeManifest(
  manifestPath: string,
  manifest: ProcessedManifest,
): Promise<void> {
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
