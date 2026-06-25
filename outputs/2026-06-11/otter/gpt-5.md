# Proposed GitHub Issues

Transcript: transcripts/2026-06-11/otter/transcript.txt
Date: 2026-06-11
Source: otter
Agent: gpt
Model: gpt-5
Review Status: pending_review

## Meeting Summary

The meeting focused on using GitHub project boards to manage Modelearth work, connecting Arts Engine and Abundance Engine through Tripo-generated 3D assets, and starting a workflow that converts Otter meeting transcripts into proposed GitHub issues for human review. Additional discussion covered Colab/GPU workflow fixes, local/non-GPU backup paths, API key handling, Azure backend questions, and new desalination scenarios to add.

## Extracted Action Items

- Ravi agreed to work on automating note taker meeting output into proposed GitHub issues.
- Investigate whether Otter or Rajat's note taker has an accessible API or endpoint and whether fees apply.
- Continue exploring GitHub project board setup, issue assignment, subtasks, and workflow states.
- Research existing GitHub repos, models, photographs, or source assets related to desalination and deep nuclear work.
- Prototype connecting Arts Engine and Abundance Engine using CSV rows of props, Tripo API output, and storyboard/component handling.
- Bring the working GPU Colab process down into a backup/local Python or notebook workflow and investigate local non-GPU issues.
- Add San Diego desal plant and Savannah desal plant scenarios from Discord.
- Ask Gary whether the web root or pipeline folder can be pulled into Azure hosting or a backend-backed deployment.

## Proposed Issues

### Issue 1

Title: Automate transcript-to-issue extraction workflow

Description:
Build the first version of a workflow that turns meeting transcripts from the note taker into proposed GitHub Issues. The workflow should read transcript files, create reviewable agent output files, and wait for human approval before any GitHub Issues are created.

Assignee: Ravi Pareshbhai Kakadia

Labels: automation, transcripts, github-issues, project-management

Priority: high

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 11:06-12:50

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 2

Title: Investigate Otter or note taker API access for transcript ingestion

Description:
Research whether Rajat's note taker or Otter provides an accessible API, webhook, or endpoint that can trigger transcript processing after each meeting. Include any pricing, permissions, or integration limits discovered.

Assignee: Ravi Pareshbhai Kakadia

Labels: research, transcripts, api, integration

Priority: high

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 12:10-12:50

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 3

Title: Define GitHub project board workflow for meeting-generated issues

Description:
Continue setting up the GitHub project board workflow so issues can be assigned, moved between statuses, broken into subtasks, and used similarly to a Jira board for project coordination.

Assignee: Ravi Pareshbhai Kakadia

Labels: github-projects, workflow, project-management

Priority: medium

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 7:46-11:06

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 4

Title: Research desalination and deep nuclear source assets for project board

Description:
Find existing GitHub repositories, models, photographs, or other source assets related to desalination and deep nuclear concepts. Add findings as candidates for the Arts Engine and Abundance Engine project board.

Assignee: null

Labels: research, desalination, deep-nuclear, arts-engine, abundance-engine

Priority: medium

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 7:46-11:06

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 5

Title: Prototype Arts Engine and Abundance Engine integration with Tripo

Description:
Experiment with connecting Arts Engine and Abundance Engine by pulling rows of props from a CSV or similar file, sending image or prop inputs to Tripo, and managing each generated asset as a storyboard/component item.

Assignee: null

Labels: prototype, tripo, arts-engine, abundance-engine, 3d-assets

Priority: medium

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 6:48-7:46 and 24:20-29:09

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 6

Title: Bring GPU Colab process into local backup workflow

Description:
Convert or bring down the working GPU Colab process into the backup workflow using either the pure Python backup file or the interactive notebook version. Investigate local non-GPU issues and document fixes that can be posted back to the Colab/Gemini workflow.

Assignee: null

Labels: colab, python, gpu, local-development, machine-learning

Priority: medium

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 16:01-19:15

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 7

Title: Add San Diego and Savannah desalination scenarios

Description:
Add the San Diego desal plant and Savannah desal plant scenarios mentioned in Discord to the relevant energy and water scenario work.

Assignee: null

Labels: desalination, scenarios, abundance-engine

Priority: low

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 19:54-24:20

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review

### Issue 8

Title: Research Azure backend option for API key handling

Description:
Investigate whether the current web root or pipeline folder can be pulled into Azure hosting or another backend-backed deployment so API key handling can move beyond browser-local storage where appropriate.

Assignee: Gary

Labels: azure, api-keys, backend, deployment

Priority: medium

Deadline: none mentioned

Meeting Reference: 2026-06-11 Otter transcript, 29:00-29:53

Similar Existing Issue: not checked

Recommended Action: create_new_issue

Review Status: pending_review
