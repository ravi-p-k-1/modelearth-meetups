import { loadGitHubConfig, parseGitHubProjectUrl } from "./config.js";
import {
  addIssueToProject,
  createGitHubIssue,
  getProjectNodeId,
} from "./client.js";
import { collectApprovedIssues } from "./reviewedIssues.js";
import { markIssueCreated } from "./updateReviewedIssue.js";

const config = await loadGitHubConfig();
const project = parseGitHubProjectUrl(config.projectUrl);
const approvedIssues = await collectApprovedIssues();

if (approvedIssues.length === 0) {
  console.log("No approved issues are ready to create.");
  process.exit(0);
}

const projectNodeId = await getProjectNodeId(
  config.token,
  project.ownerType,
  project.owner,
  project.projectNumber,
);

for (const { issue, source } of approvedIssues) {
  console.log(`Creating GitHub issue: ${issue.title}`);

  const githubIssue = await createGitHubIssue(config, issue);

  await addIssueToProject(config.token, projectNodeId, githubIssue.nodeId);

  await markIssueCreated(source.jsonPath, issue.id, githubIssue, {
    url: config.projectUrl,
    linked: true,
    linkedAt: new Date().toISOString(),
  });

  console.log(`Created ${githubIssue.url}`);
}

console.log(`Created and linked ${approvedIssues.length} GitHub issue(s).`);
