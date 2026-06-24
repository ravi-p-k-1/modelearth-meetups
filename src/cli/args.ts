import type { CliOptions } from "../interfaces/cli/cliOptions.js";
import { parseArgs } from "../utils/cli/parseArgs.js";

// Converts raw CLI flags into repo defaults used by the transcript scan command.
export function parseCliOptions(rawArgs: string[]): CliOptions {
  const args = parseArgs(rawArgs);

  return {
    agent: args.agent ?? "gpt",
    model: args.model ?? "gpt-5",
    transcriptsDir: args.transcriptsDir ?? "transcripts",
    outputsDir: args.outputsDir ?? "outputs",
    manifestPath: args.manifestPath ?? "processed-manifest.json",
  };
}
