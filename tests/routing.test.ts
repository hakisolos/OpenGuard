import { describe, expect, test } from "bun:test"
import {
  shouldReviewIssue,
  shouldReviewIssueComment,
  shouldReviewPullRequest,
  shouldReviewPullRequestReviewComment,
} from "../src/events/routing"
import type {
  IssueCommentPayload,
  IssuesPayload,
  PullRequestPayload,
  PullRequestReviewCommentPayload,
} from "../src/types/github"

const sender = { login: "alice", html_url: "https://github.com/alice" }
const repository = {
  name: "repo",
  full_name: "owner/repo",
  html_url: "https://github.com/owner/repo",
  owner: { login: "owner" },
}
const pullRequest = {
  number: 12,
  title: "Improve auth",
  body: "body",
  html_url: "https://github.com/owner/repo/pull/12",
  diff_url: "https://github.com/owner/repo/pull/12.diff",
  base: { ref: "main" },
  head: { ref: "feature", sha: "abc" },
  user: sender,
}
const issue = {
  number: 4,
  title: "Bug report",
  body: "body",
  html_url: "https://github.com/owner/repo/issues/4",
  user: sender,
}
const comment = {
  body: "Please review this",
  html_url: "https://github.com/owner/repo/pull/12#issuecomment-1",
  user: sender,
}

describe("event routing", () => {
  test("reviews actionable pull requests to main", () => {
    expect(
      shouldReviewPullRequest({
        action: "opened",
        repository,
        sender,
        pull_request: pullRequest,
      } satisfies PullRequestPayload),
    ).toBe(true)

    expect(
      shouldReviewPullRequest({
        action: "closed",
        repository,
        sender,
        pull_request: pullRequest,
      } satisfies PullRequestPayload),
    ).toBe(false)
  })

  test("ignores pull requests targeting non-main branches", () => {
    expect(
      shouldReviewPullRequest({
        action: "opened",
        repository,
        sender,
        pull_request: { ...pullRequest, base: { ref: "develop" } },
      } satisfies PullRequestPayload),
    ).toBe(false)
  })

  test("reviews real issues but not pull request issue wrappers", () => {
    expect(
      shouldReviewIssue({
        action: "opened",
        repository,
        sender,
        issue,
      } satisfies IssuesPayload),
    ).toBe(true)

    expect(
      shouldReviewIssue({
        action: "opened",
        repository,
        sender,
        issue: { ...issue, pull_request: {} },
      } satisfies IssuesPayload),
    ).toBe(false)
  })

  test("reviews pull request conversation and inline comments", () => {
    expect(
      shouldReviewIssueComment({
        action: "created",
        repository,
        sender,
        issue: { ...issue, pull_request: {} },
        comment,
      } satisfies IssueCommentPayload),
    ).toBe(true)

    expect(
      shouldReviewPullRequestReviewComment({
        action: "edited",
        repository,
        sender,
        pull_request: pullRequest,
        comment,
      } satisfies PullRequestReviewCommentPayload),
    ).toBe(true)
  })
})
