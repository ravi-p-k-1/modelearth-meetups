import type {
  ReviewedIssue,
  TranscriptReviewStatus,
} from "../dashboard/reviewData.js";

export interface FinalReviewedJson {
  transcript: {
    date: string;
    source: string;
    transcriptPath: string;
  };
  agent: string;
  model: string;
  reviewStatus: TranscriptReviewStatus;
  issues: ReviewedIssue[];
}

export interface RawFinalReviewedJson {
  transcript: {
    date: string;
    source: string;
    transcriptPath: string;
  };
  agent: string;
  model: string;
  reviewStatus?: string;
  issues: Array<Omit<ReviewedIssue, "reviewStatus"> & { reviewStatus?: string }>;
}
