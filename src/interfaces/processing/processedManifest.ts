import type { AgentRun } from "../agents/agentRun.js";

// One record means the transcript has produced reviewable output files.
export interface ProcessedTranscriptRecord extends AgentRun {
  transcriptPath: string;
  markdownOutputPath: string;
  jsonOutputPath: string;
  processedAt: string;
}

// Top-level shape of processed-manifest.json.
export interface ProcessedManifest {
  processed: ProcessedTranscriptRecord[];
}
