import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import type { TranscriptSource } from "../interfaces/transcripts/transcriptSource.js";

// Mirrors transcripts/<date>/<source>/ to outputs/<date>/<source>/.
export function getOutputDirectoryForTranscript(
  outputsDir: string,
  transcript: TranscriptSource,
): string {
  return path.join(outputsDir, transcript.date, transcript.source);
}

// Finds transcript.txt files using the repo's required date/source folder shape.
export async function scanTranscripts(transcriptsDir: string): Promise<TranscriptSource[]> {
  const transcriptSources: TranscriptSource[] = [];
  const dateEntries = await readdir(transcriptsDir, { withFileTypes: true });

  for (const dateEntry of dateEntries) {
    if (!dateEntry.isDirectory()) {
      continue;
    }

    const date = dateEntry.name;
    const dateDir = path.join(transcriptsDir, date);
    const sourceEntries = await readdir(dateDir, { withFileTypes: true });

    for (const sourceEntry of sourceEntries) {
      if (!sourceEntry.isDirectory()) {
        continue;
      }

      const source = sourceEntry.name;
      const transcriptPath = path.join(dateDir, source, "transcript.txt");

      if (!(await fileExists(transcriptPath))) {
        continue;
      }

      transcriptSources.push({
        date,
        source,
        transcriptPath,
      });
    }
  }

  return transcriptSources;
}

// Date/source folders may exist before a transcript is added, so the scanner
// only returns folders that already contain transcript.txt.
async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fileStats = await stat(filePath);
    return fileStats.isFile();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
