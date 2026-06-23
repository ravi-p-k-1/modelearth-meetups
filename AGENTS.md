# AGENTS.md

This repo supports a coding-agent-assisted workflow for turning meeting transcripts into proposed GitHub Issues. Agents produce reviewable output files only; they must not directly create GitHub Issues without human review.

For each date/source folder, for example:

```text
transcripts/2026-06-11/otter
```

create a corresponding output file named:

```text
outputs/2026-06-11/otter/[agent]-[model].md
```

Examples:

```text
outputs/2026-06-11/otter/gemini-2.5.md
outputs/2026-06-11/otter/gpt-5.md
```

Each agent should process the original transcript and:

- Identify action items, tasks, owners, priorities, and deadlines mentioned during the meeting.
- Convert extracted tasks into proposed GitHub Issues.
- Include issue title, description, assignee, labels, and meeting reference.
- Check whether a similar issue already exists when issue-matching logic is available.
- Recommend one of the following actions:
  - create_new_issue
  - update_existing_issue
  - no_action
- Do not directly create issues without human review.

Before processing any transcript:

- Check `processed-manifest.json`.
- Skip processing if the transcript is already marked as processed.
- Process only transcripts not listed in the manifest.
- Update the manifest after successful processing.

To reprocess a transcript:

- Manually remove its record from `processed-manifest.json`.
- Run the agent again.

Configuration:

- Target GitHub repository details should be configured through `.env`.
- Use `.env.example` as the template.
- The first implementation should focus on proposed issue output files, not direct GitHub issue creation.

Repo structure:

```text
modelearth-meetups/
|-- AGENTS.md
|-- README.md
|-- .env.example
|-- processed-manifest.json
|
|-- transcripts/
|   `-- 2026-06-11/
|       `-- otter/
|           `-- transcript.txt
|
|-- outputs/
|   `-- 2026-06-11/
|       `-- otter/
|           |-- gemini-2.5.md
|           |-- gpt-5.md
|           `-- final-reviewed.json
|
|-- src/
|   |-- processing/
|   |   |-- manifestManager.ts
|   |   `-- transcriptScanner.ts
|   |
|   |-- agents/
|   |   |-- transcriptParser.ts
|   |   |-- issueMatcher.ts
|   |   |-- issueUpdater.ts
|   |   `-- reviewer.ts
|   |
|   |-- github/
|   |   |-- fetchIssues.ts
|   |   |-- createIssue.ts
|   |   `-- updateIssue.ts
|   |
|   |-- storage/
|   |   `-- issueMemory.ts
|   |
|   `-- main.ts
|
`-- dashboard/
    `-- review-ui/
```
