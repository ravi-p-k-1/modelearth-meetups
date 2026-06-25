import type { CliOptions } from "../../interfaces/cli/cliOptions.js";

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

// Minimal --key value parser for this repo's simple scan command.
function parseArgs(rawArgs: string[]): Record<string, string | undefined> {
  const parsed: Record<string, string | undefined> = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const rawArg = rawArgs[index];

    if (!rawArg?.startsWith("--")) {
      continue;
    }

    const key = rawArg.slice(2);
    parsed[key] = rawArgs[index + 1];
    index += 1;
  }

  return parsed;
}
