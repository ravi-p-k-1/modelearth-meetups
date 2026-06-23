export interface ProcessedTranscriptRecord {
  transcriptPath: string;
  outputPath: string;
  processedAt: string;
  agent: string;
  model: string;
}

export interface ProcessedManifest {
  processed: ProcessedTranscriptRecord[];
}

export function isTranscriptProcessed(
  manifest: ProcessedManifest,
  transcriptPath: string,
): boolean {
  return manifest.processed.some((record) => record.transcriptPath === transcriptPath);
}
