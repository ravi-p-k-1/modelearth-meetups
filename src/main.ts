import { isTranscriptProcessed, type ProcessedManifest } from "./processing/manifestManager.js";

const manifest: ProcessedManifest = {
  processed: [],
};

const exampleTranscriptPath = "transcripts/2026-06-11/otter/transcript.txt";

if (isTranscriptProcessed(manifest, exampleTranscriptPath)) {
  console.log(`Skipping already processed transcript: ${exampleTranscriptPath}`);
} else {
  console.log(`Ready to process transcript: ${exampleTranscriptPath}`);
}
