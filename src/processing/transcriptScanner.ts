export interface TranscriptSource {
  date: string;
  source: string;
  transcriptPath: string;
}

export function getOutputDirectoryForTranscript(
  outputsDir: string,
  transcript: TranscriptSource,
): string {
  return `${outputsDir}/${transcript.date}/${transcript.source}`;
}
