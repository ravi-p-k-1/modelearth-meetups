import type { ReviewedIssue } from "../../interfaces/dashboard/reviewData.js";

export function buildIssueBody(issue: ReviewedIssue): string {
  return `## Description

${issue.description}

## Review Metadata

- Proposed assignee: ${issue.assignee ?? "unassigned"}
- Priority: ${issue.priority ?? "none"}
- Deadline: ${issue.deadline ?? "none"}
- Meeting reference: ${issue.meetingReference}
- Recommended action: ${issue.recommendedAction}
- Similar existing issue: ${issue.similarExistingIssue ?? "not checked"}
- Source issue id: ${issue.id}
`;
}
