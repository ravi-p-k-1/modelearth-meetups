import { createAgentOutputPlaceholders } from "./outputs/agentOutputWriter.js";
import { isTranscriptProcessed, readManifest, writeManifest } from "./processing/manifestManager.js";
import { parseCliOptions } from "./utils/cli/args.js";
import { scanTranscripts } from "./processing/transcriptScanner.js";
import { normalizePathForManifest } from "./utils/paths/normalizePath.js";

// CLI workflow entry point: prepare agent output files for transcripts that
// have not already been processed by any agent/model.
const options = parseCliOptions(process.argv.slice(2));
const agentRun = {
  agent: options.agent,
  model: options.model,
};

const manifest = await readManifest(options.manifestPath);
const transcripts = await scanTranscripts(options.transcriptsDir);

for (const transcript of transcripts) {
  // A transcript is skipped once any agent has processed it. Reprocessing is
  // controlled by manually removing its entry from processed-manifest.json.
  if (isTranscriptProcessed(manifest, transcript.transcriptPath)) {
    console.log(`Skipping already processed transcript: ${transcript.transcriptPath}`);
    continue;
  }

  const outputPaths = await createAgentOutputPlaceholders(
    options.outputsDir,
    transcript,
    agentRun,
  );

  // Store normalized paths so the manifest stays stable across Windows/macOS/Linux.
  manifest.processed.push({
    transcriptPath: normalizePathForManifest(transcript.transcriptPath),
    markdownOutputPath: normalizePathForManifest(outputPaths.markdownOutputPath),
    jsonOutputPath: normalizePathForManifest(outputPaths.jsonOutputPath),
    processedAt: new Date().toISOString(),
    agent: agentRun.agent,
    model: agentRun.model,
  });

  console.log(`Created output files for ${transcript.transcriptPath}`);
}

await writeManifest(options.manifestPath, manifest);
