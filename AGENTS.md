# AGENTS.md

This repo supports a coding-agent-assisted workflow for turning meeting transcripts into proposed GitHub Issues.

Agents such as Codex, Claude, Gemini, or Copilot should read transcripts, extract proposed issues, and write reviewable output files. Agents must not directly create GitHub Issues unless a human explicitly asks them to do so after review.

## Core Rules

- Process transcripts from `transcripts/<date>/<source>/transcript.txt`.
- Write agent output to `outputs/<date>/<source>/[agent]-[model].md`.
- Write structured extracted issues to `outputs/<date>/<source>/final-reviewed.json`.
- Check `processed-manifest.json` before processing.
- If a transcript is already listed in `processed-manifest.json`, skip it even if it was processed by another agent/model.
- To reprocess a transcript, manually remove its record from `processed-manifest.json`, then run the workflow again.
- Do not create GitHub Issues directly. Only propose issues for human review.
- Use `.env.example` as the template for future GitHub repo and project configuration.

## Configuration

Future GitHub issue creation should read target details from `.env`:

```text
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_PROJECT=
GITHUB_TOKEN=
```

`GITHUB_PROJECT` should identify the GitHub Project linked to the target repo.

## First-Time Setup

Install dependencies:

```powershell
npm.cmd install
```

Validate TypeScript:

```powershell
npm.cmd run build
```

## Standard Agent Workflow

1. Confirm the transcript exists:

```text
transcripts/<date>/<source>/transcript.txt
```

2. Run the scan command with your agent/model name:

```powershell
npm.cmd run scan -- --agent gpt --model gpt-5
```

Examples:

```powershell
npm.cmd run scan -- --agent claude --model sonnet
npm.cmd run scan -- --agent gemini --model 2.5
```

3. If the transcript is skipped, stop processing that transcript.

4. If output files are created, read the transcript and populate both:

```text
outputs/<date>/<source>/<agent>-<model>.md
outputs/<date>/<source>/final-reviewed.json
```

5. Keep every proposed issue marked `pending_review` unless a human has reviewed it.

6. Run validation:

```powershell
npm.cmd run build
```

For JSON output, also make sure `final-reviewed.json` parses successfully.

## Dashboard Workflow

The dashboard is a static review UI. It does not scan `outputs/` directly and does not write changes back to JSON files.

After creating or editing any `outputs/<date>/<source>/final-reviewed.json` file, regenerate dashboard data:

```powershell
npm.cmd run dashboard:data
```

This writes:

```text
dashboard/review-ui/review-data.json
```

The static dashboard reads that generated file.

Dashboard files:

```text
dashboard/review-ui/index.html
dashboard/review-ui/app.js
dashboard/review-ui/styles.css
dashboard/review-ui/review-data.json
```

Because the dashboard uses browser `fetch()` to load `review-data.json`, open it through a local static server instead of `file://`.

Example:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dashboard/review-ui
```

Then open:

```text
http://localhost:4173
```

Dashboard behavior:

- `Pending Issues` shows only issues with `reviewStatus: "pending_review"`.
- `All Issues` shows all issues.
- The first table shows transcript dates.
- Clicking a date shows data sources for that date.
- Clicking a data source shows issues from that transcript/source.
- Clicking an issue shows full issue details.
- The dashboard is read-only. To change statuses, manually edit `final-reviewed.json` or ask an agent to update it, then rerun `npm.cmd run dashboard:data`.

## GitHub Issue Creation

To create GitHub Issues and link them to the configured GitHub Project:

```powershell
npm.cmd run github:create
```

Creation rules:

- Only files with top-level `reviewStatus: "review_complete"` are considered.
- Only issues with `reviewStatus: "approved"` are created.
- Issues with `reviewStatus: "rejected"` are ignored.
- Issues with `reviewStatus: "pending_review"` are ignored.
- Issues that already have `githubIssue` metadata are skipped to avoid duplicates.
- Transcript assignee names are included in the GitHub issue body, but they are not sent as GitHub assignees because transcript names may not be GitHub usernames.
- After creation, `final-reviewed.json` is updated with `githubIssue` and `githubProject` metadata.

Required `.env` values:

```text
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_PROJECT=
GITHUB_TOKEN=
```

`GITHUB_PROJECT` must be the full project URL:

```text
https://github.com/orgs/modelearth/projects/3
https://github.com/users/ravi-p-k-1/projects/2
```

If project linking fails with `Resource not accessible by personal access token`, the token cannot access the configured GitHub Project. For fine-grained tokens, grant organization `Projects: Read and write` access and confirm the token owner can access the org/project. If the organization requires SSO, authorize the token for that organization.

## What To Extract

For each transcript, identify:

- Action items
- Tasks
- Owners or likely assignees
- Priorities
- Deadlines
- Meeting references or timestamps
- Relevant labels
- Whether the proposed issue should be created, update an existing issue, or require no action

If a field is not clear from the transcript, use `null` in JSON and explain uncertainty in Markdown.

## Recommended Markdown Format

Each `[agent]-[model].md` file should include:

```markdown
# Proposed GitHub Issues

Transcript:
Date:
Source:
Agent:
Model:
Review Status: in_review

## Meeting Summary

## Extracted Action Items

## Proposed Issues

### Issue 1

Title:
Description:
Assignee:
Labels:
Priority:
Deadline:
Meeting Reference:
Similar Existing Issue:
Recommended Action:
Review Status: pending_review
```

Use one issue section per proposed GitHub Issue.

## Required JSON Format

`final-reviewed.json` should follow this shape:

```json
{
  "transcript": {
    "date": "2026-06-11",
    "source": "otter",
    "transcriptPath": "transcripts/2026-06-11/otter/transcript.txt"
  },
  "agent": "gpt",
  "model": "gpt-5",
  "reviewStatus": "in_review",
  "issues": [
    {
      "id": "2026-06-11-otter-001",
      "title": "Issue title",
      "description": "Issue description",
      "assignee": null,
      "labels": ["label-one", "label-two"],
      "priority": "medium",
      "deadline": null,
      "meetingReference": "2026-06-11 Otter transcript, 11:06-12:50",
      "similarExistingIssue": null,
      "existingIssueCheckStatus": "not_checked",
      "recommendedAction": "create_new_issue",
      "reviewStatus": "pending_review"
    }
  ]
}
```

Allowed `recommendedAction` values:

- `create_new_issue`
- `update_existing_issue`
- `no_action`

Allowed `reviewStatus` values:

- `pending_review`
- `approved`
- `rejected`

Allowed `priority` values:

- `low`
- `medium`
- `high`
- `null`

## Similar Issue Checking

The current implementation does not automatically check existing GitHub Issues.

Until that logic exists:

- Set `similarExistingIssue` to `null` when no check has been performed.
- Set `existingIssueCheckStatus` to `not_checked`.
- Do not claim an issue is unique unless you actually checked the target GitHub repo.

## Manifest Behavior

`processed-manifest.json` is the source of truth for processed transcripts.

The scan command writes entries like:

```json
{
  "transcriptPath": "transcripts/2026-06-11/otter/transcript.txt",
  "markdownOutputPath": "outputs/2026-06-11/otter/gpt-5.md",
  "jsonOutputPath": "outputs/2026-06-11/otter/final-reviewed.json",
  "processedAt": "2026-06-23T23:50:38.310Z",
  "agent": "gpt",
  "model": "gpt-5"
}
```

Once a transcript path appears in the manifest, later agents should skip it. This prevents multiple agents from producing conflicting issue sets for the same transcript.

## Repo Structure

```text
modelearth-meetups/
|-- AGENTS.md
|-- README.md
|-- .env.example
|-- package.json
|-- processed-manifest.json
|-- tsconfig.json
|
|-- transcripts/
|   `-- 2026-06-11/
|       `-- otter/
|           `-- transcript.txt
|
|-- outputs/
|   `-- 2026-06-11/
|       `-- otter/
|           |-- gpt-5.md
|           `-- final-reviewed.json
|
|-- src/
|   |-- github/
|   |   |-- client.ts
|   |   |-- config.ts
|   |   |-- createIssues.ts
|   |   |-- reviewedIssues.ts
|   |   `-- updateReviewedIssue.ts
|   |-- interfaces/
|   |   |-- agents/
|   |   |   |-- agentRun.ts
|   |   |   `-- proposedIssue.ts
|   |   |-- cli/
|   |   |   `-- cliOptions.ts
|   |   |-- dashboard/
|   |   |   `-- reviewData.ts
|   |   |-- github/
|   |   |   |-- approvedIssue.ts
|   |   |   |-- githubApi.ts
|   |   |   |-- githubConfig.ts
|   |   |   `-- githubIssueMetadata.ts
|   |   |-- outputs/
|   |   |   |-- agentOutputPaths.ts
|   |   |   `-- finalReviewedJson.ts
|   |   |-- processing/
|   |   |   `-- processedManifest.ts
|   |   `-- transcripts/
|   |       `-- transcriptSource.ts
|   |-- outputs/
|   |   |-- agentOutputWriter.ts
|   |   `-- generateReviewData.ts
|   |-- processing/
|   |   |-- manifestManager.ts
|   |   `-- transcriptScanner.ts
|   |-- utils/
|   |   |-- cli/
|   |   |   `-- args.ts
|   |   |-- env/
|   |   |   `-- loadEnv.ts
|   |   |-- github/
|   |   |   |-- graphql.ts
|   |   |   |-- headers.ts
|   |   |   `-- issueBody.ts
|   |   `-- paths/
|   |       `-- normalizePath.ts
|   `-- main.ts
|
`-- dashboard/
    `-- review-ui/
        |-- app.js
        |-- index.html
        |-- review-data.json
        `-- styles.css
```
