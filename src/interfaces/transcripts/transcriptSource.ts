// A discovered transcript in transcripts/<date>/<source>/transcript.txt.
export interface TranscriptSource {
  date: string;
  source: string;
  transcriptPath: string;
}
