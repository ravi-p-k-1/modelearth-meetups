const state = {
  data: null,
  tab: "pending",
  view: "dates",
  date: null,
  source: null,
  issueId: null,
};

const content = document.querySelector("#content");
const breadcrumb = document.querySelector("#breadcrumb");
const backButton = document.querySelector("#backButton");
const pendingTab = document.querySelector("#pendingTab");
const allTab = document.querySelector("#allTab");
const generatedAt = document.querySelector("#generatedAt");

init();

async function init() {
  try {
    const response = await fetch("./review-data.json");
    state.data = await response.json();
    generatedAt.textContent = `Data generated: ${formatDateTime(state.data.generatedAt)}`;
    bindEvents();
    render();
  } catch (error) {
    content.innerHTML = `<div class="empty-state">Unable to load review-data.json.</div>`;
    console.error(error);
  }
}

function bindEvents() {
  pendingTab.addEventListener("click", () => setTab("pending"));
  allTab.addEventListener("click", () => setTab("all"));
  backButton.addEventListener("click", goBack);
}

function setTab(tab) {
  state.tab = tab;
  state.view = "dates";
  state.date = null;
  state.source = null;
  state.issueId = null;
  render();
}

function goBack() {
  if (state.view === "issue") {
    state.view = "issues";
    state.issueId = null;
  } else if (state.view === "issues") {
    state.view = "sources";
    state.source = null;
  } else if (state.view === "sources") {
    state.view = "dates";
    state.date = null;
  }

  render();
}

function render() {
  pendingTab.classList.toggle("active", state.tab === "pending");
  allTab.classList.toggle("active", state.tab === "all");
  backButton.hidden = state.view === "dates";
  renderBreadcrumb();

  if (state.view === "dates") {
    renderDates();
  } else if (state.view === "sources") {
    renderSources();
  } else if (state.view === "issues") {
    renderIssues();
  } else {
    renderIssueDetail();
  }
}

function renderBreadcrumb() {
  const items = [state.tab === "pending" ? "Pending Issues" : "All Issues"];

  if (state.date) {
    items.push(state.date);
  }

  if (state.source) {
    items.push(state.source);
  }

  if (state.issueId) {
    items.push("Issue Detail");
  }

  breadcrumb.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderDates() {
  const rows = getVisibleSources();
  const dates = [...new Set(rows.map((source) => source.date))].sort();

  if (dates.length === 0) {
    content.innerHTML = `<div class="empty-state">No issues found for this tab.</div>`;
    return;
  }

  const issueCount = rows.reduce((sum, source) => sum + getVisibleIssues(source).length, 0);

  content.innerHTML = `
    ${renderSectionHeader("Transcript Dates", `${dates.length} date(s), ${issueCount} issue(s)`)}
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Review Status</th>
          <th>Sources</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
        ${dates.map((date) => renderDateRow(date)).join("")}
      </tbody>
    </table>
  `;

  content.querySelectorAll("[data-date]").forEach((row) => {
    row.addEventListener("click", () => {
      state.view = "sources";
      state.date = row.dataset.date;
      render();
    });
  });
}

function renderDateRow(date) {
  const sources = getVisibleSources().filter((source) => source.date === date);
  const issueCount = sources.reduce((sum, source) => sum + getVisibleIssues(source).length, 0);
  const status = sources.some((source) => source.reviewStatus === "in_review")
    ? "in_review"
    : "review_complete";

  return `
    <tr class="clickable" data-date="${escapeHtml(date)}">
      <td>${escapeHtml(date)}</td>
      <td>${renderStatus(status)}</td>
      <td>${sources.length}</td>
      <td>${issueCount}</td>
    </tr>
  `;
}

function renderSources() {
  const sources = getVisibleSources().filter((source) => source.date === state.date);

  if (sources.length === 0) {
    content.innerHTML = `<div class="empty-state">No data sources found.</div>`;
    return;
  }

  const issueCount = sources.reduce((sum, source) => sum + getVisibleIssues(source).length, 0);

  content.innerHTML = `
    ${renderSectionHeader("Data Sources", `${sources.length} source(s), ${issueCount} issue(s)`)}
    <table class="table">
      <thead>
        <tr>
          <th>Data Source</th>
          <th>Review Status</th>
          <th>Agent</th>
          <th>Model</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
        ${sources.map(renderSourceRow).join("")}
      </tbody>
    </table>
  `;

  content.querySelectorAll("[data-source]").forEach((row) => {
    row.addEventListener("click", () => {
      state.view = "issues";
      state.source = row.dataset.source;
      render();
    });
  });
}

function renderSourceRow(source) {
  return `
    <tr class="clickable" data-source="${escapeHtml(source.source)}">
      <td>${escapeHtml(source.source)}</td>
      <td>${renderStatus(source.reviewStatus)}</td>
      <td>${escapeHtml(source.agent)}</td>
      <td>${escapeHtml(source.model)}</td>
      <td>${getVisibleIssues(source).length}</td>
    </tr>
  `;
}

function renderIssues() {
  const source = getSelectedSource();
  const issues = getVisibleIssues(source);

  if (issues.length === 0) {
    content.innerHTML = `<div class="empty-state">No issues found for this source.</div>`;
    return;
  }

  content.innerHTML = `
    ${renderSectionHeader("Issues", `${issues.length} issue(s)`)}
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Assignee</th>
        </tr>
      </thead>
      <tbody>
        ${issues.map(renderIssueRow).join("")}
      </tbody>
    </table>
  `;

  content.querySelectorAll("[data-issue-id]").forEach((row) => {
    row.addEventListener("click", () => {
      state.view = "issue";
      state.issueId = row.dataset.issueId;
      render();
    });
  });
}

function renderIssueRow(issue) {
  return `
    <tr class="clickable" data-issue-id="${escapeHtml(issue.id)}">
      <td>${escapeHtml(issue.title)}</td>
      <td>${renderStatus(issue.reviewStatus)}</td>
      <td>${escapeHtml(issue.priority ?? "none")}</td>
      <td>${escapeHtml(issue.assignee ?? "unassigned")}</td>
    </tr>
  `;
}

function renderIssueDetail() {
  const issue = getSelectedIssue();

  if (!issue) {
    content.innerHTML = `<div class="empty-state">Issue not found.</div>`;
    return;
  }

  content.innerHTML = `
    <article class="detail-view">
      <div class="detail-heading">
        <h2>${escapeHtml(issue.title)}</h2>
        ${renderStatus(issue.reviewStatus)}
      </div>
      <div class="detail-grid">
        <div class="detail-label">Description</div>
        <div>${escapeHtml(issue.description)}</div>
        <div class="detail-label">Assignee</div>
        <div>${escapeHtml(issue.assignee ?? "unassigned")}</div>
        <div class="detail-label">Labels</div>
        <div>${renderLabels(issue.labels)}</div>
        <div class="detail-label">Priority</div>
        <div>${escapeHtml(issue.priority ?? "none")}</div>
        <div class="detail-label">Deadline</div>
        <div>${escapeHtml(issue.deadline ?? "none")}</div>
        <div class="detail-label">Meeting Reference</div>
        <div>${escapeHtml(issue.meetingReference)}</div>
        <div class="detail-label">Similar Existing Issue</div>
        <div>${escapeHtml(issue.similarExistingIssue ?? "not checked")}</div>
        <div class="detail-label">Recommended Action</div>
        <div>${escapeHtml(issue.recommendedAction)}</div>
      </div>
    </article>
  `;
}

function renderSectionHeader(title, summary) {
  return `
    <div class="section-header">
      <h2>${escapeHtml(title)}</h2>
      <span>${escapeHtml(summary)}</span>
    </div>
  `;
}

function getVisibleSources() {
  if (state.tab === "all") {
    return state.data.sources;
  }

  return state.data.sources.filter((source) => getVisibleIssues(source).length > 0);
}

function getVisibleIssues(source) {
  if (!source) {
    return [];
  }

  if (state.tab === "all") {
    return source.issues;
  }

  return source.issues.filter((issue) => issue.reviewStatus === "pending_review");
}

function getSelectedSource() {
  return state.data.sources.find(
    (source) => source.date === state.date && source.source === state.source,
  );
}

function getSelectedIssue() {
  const source = getSelectedSource();
  return source?.issues.find((issue) => issue.id === state.issueId);
}

function renderStatus(status) {
  return `<span class="status-tag status-${escapeHtml(status)}">${formatStatus(status)}</span>`;
}

function renderLabels(labels) {
  if (!labels || labels.length === 0) {
    return "none";
  }

  return `<div class="label-list">${labels
    .map((label) => `<span class="label-tag">${escapeHtml(label)}</span>`)
    .join("")}</div>`;
}

function formatStatus(status) {
  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateTime(value) {
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
