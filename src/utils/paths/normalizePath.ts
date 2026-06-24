// Manifest paths use forward slashes so comparisons work consistently across OSes.
export function normalizePathForManifest(filePath: string): string {
  return filePath.replaceAll("\\", "/");
}
