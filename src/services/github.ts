import { config, hasGithubConfig } from "../configs/env"
import type { PullRequest } from "../types/github"
import type { ReviewDecision } from "../types/review"

const githubFetch = async <T>(path: string, init: RequestInit = {}) => {
  if (!hasGithubConfig()) {
    throw new Error("GITHUB_TOKEN is required for GitHub API actions")
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status} for ${path}`)
  }

  return (await response.json()) as T
}

export const fetchPullRequest = (repo: string, pullNumber: number) =>
  githubFetch<PullRequest>(`/repos/${repo}/pulls/${pullNumber}`)

export const fetchPullRequestDiff = async (repo: string, pullNumber: number) => {
  if (!hasGithubConfig()) {
    throw new Error("GITHUB_TOKEN is required for GitHub API actions")
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/pulls/${pullNumber}`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
      Authorization: `Bearer ${config.githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub diff request failed with ${response.status}`)
  }

  return response.text()
}

export const createIssueComment = (repo: string, issueNumber: number, body: string) =>
  githubFetch(`/repos/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  })

const reviewEvent = (decision: ReviewDecision) => {
  if (decision === "approve") {
    return "APPROVE"
  }

  if (decision === "request_changes") {
    return "REQUEST_CHANGES"
  }

  return "COMMENT"
}

export const createPullRequestReview = (
  repo: string,
  pullNumber: number,
  decision: ReviewDecision,
  body: string,
) =>
  githubFetch(`/repos/${repo}/pulls/${pullNumber}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      event: reviewEvent(decision),
      body,
    }),
  })
