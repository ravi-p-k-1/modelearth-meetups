import { readFile } from "node:fs/promises";

export async function loadEnvFile(envPath = ".env"): Promise<Record<string, string>> {
  try {
    const rawEnv = await readFile(envPath, "utf8");
    return parseEnv(rawEnv);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

function parseEnv(rawEnv: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const line of rawEnv.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    values[key] = value;
  }

  return values;
}
