// Minimal --key value parser for this repo's simple scan command.
export function parseArgs(rawArgs: string[]): Record<string, string | undefined> {
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
