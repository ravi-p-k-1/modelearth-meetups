import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AgentRun } from "../interfaces/agents/agentRun.js";
import type { AgentOutputPaths } from "../interfaces/outputs/agentOutputPaths.js";
import type { TranscriptSource } from "../interfaces/transcripts/transcriptSource.js";
import { normalizePathForManifest } from "../utils/paths/normalizePath.js";

// Creates the two files an agent is expected to fill/review for a transcript:
// a readable Markdown extraction and a structured JSON issue list.
export async function createAgentOutputPlaceholders(
  outputsDir: string,
  transcript: TranscriptSource,
  agentRun: AgentRun,
): Promise<AgentOutputPaths> {
  const outputDir = path.join(outputsDir, transcript.date, transcript.source);
  const outputBaseName = getAgentOutputBaseName(agentRun);
  const markdownOutputPath = path.join(outputDir, `${outputBaseName}.md`);
  const jsonOutputPath = path.join(outputDir, "final-reviewed.json");

  await mkdir(outputDir, { recursive: true });
  // Use exclusive writes so reruns do not overwrite existing agent work.
  await writeFile(markdownOutputPath, buildMarkdownTemplate(transcript, agentRun), {
    flag: "wx",
  });
  await writeFile(jsonOutputPath, buildJsonTemplate(transcript, agentRun), {
    flag: "wx",
  });

  return {
    markdownOutputPath,
    jsonOutputPath,
  };
}

// If the model name already includes the agent prefix, keep the cleaner name
// like gpt-5 instead of producing gpt-gpt-5.
function getAgentOutputBaseName(agentRun: AgentRun): string {
  return agentRun.model.startsWith(`${agentRun.agent}-`)
    ? agentRun.model
    : `${agentRun.agent}-${agentRun.model}`;
}

// Template intentionally contains empty sections. The coding agent, not this
// script, performs the transcript analysis and fills these sections.
function buildMarkdownTemplate(transcript: TranscriptSource, agentRun: AgentRun): string {
  const transcriptPath = normalizePathForManifest(transcript.transcriptPath);

  return `# Proposed GitHub Issues

Transcript: ${transcriptPath}
Date: ${transcript.date}
Source: ${transcript.source}
Agent: ${agentRun.agent}
Model: ${agentRun.model}

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
`;
}

// The JSON starts empty and is filled after an agent extracts proposed issues.
function buildJsonTemplate(transcript: TranscriptSource, agentRun: AgentRun): string {
  const normalizedTranscript = {
    ...transcript,
    transcriptPath: normalizePathForManifest(transcript.transcriptPath),
  };

  return `${JSON.stringify(
    {
      transcript: normalizedTranscript,
      agent: agentRun.agent,
      model: agentRun.model,
      reviewStatus: "in_review",
      issues: [],
    },
    null,
    2,
  )}\n`;
}
