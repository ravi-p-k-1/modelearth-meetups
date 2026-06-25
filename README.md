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
