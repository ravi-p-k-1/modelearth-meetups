import type { TranscriptAnalysis } from "./transcriptParser.js";

export interface ReviewDocument {
  analysis: TranscriptAnalysis;
  reviewerNotes: string[];
}
