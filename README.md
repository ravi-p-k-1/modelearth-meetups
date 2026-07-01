# modelearth-meetups

This repo turns meeting transcripts into proposed GitHub Issues for human review.

Agents create review files only. They should not directly create GitHub Issues unless a human explicitly asks them to do so after review.

## Setup

```powershell
npm.cmd install
npm.cmd run build
```

## Process Transcripts

Place transcripts here:

```text
transcripts/<date>/<source>/transcript.txt
```

Create agent output placeholders:

```powershell
npm.cmd run scan -- --agent gpt --model gpt-5
```

The agent then fills:

```text
outputs/<date>/<source>/<agent>-<model>.md
outputs/<date>/<source>/final-reviewed.json
```

## Dashboard

Regenerate dashboard data after issue JSON changes:

```powershell
npm.cmd run dashboard:data
```

Start a local static server:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dashboard/review-ui
```

Open:

```text
http://localhost:4173
```

## Create GitHub Issues

Only approved issues from review-complete files are eligible.

Create issues and link them to the configured GitHub Project:

```powershell
npm.cmd run github:create
```

Required `.env` values:

```text
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_PROJECT=
GITHUB_TOKEN=
```

`GITHUB_PROJECT` should be the full project URL:

```text
https://github.com/orgs/modelearth/projects/3
https://github.com/users/ravi-p-k-1/projects/2
```

If project linking fails with `Resource not accessible by personal access token`, update `GITHUB_TOKEN` so it can access the GitHub Project. For a fine-grained token, grant organization `Projects: Read and write` access, and make sure the token owner has access to the org/project.
