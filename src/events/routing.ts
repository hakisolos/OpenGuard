import type {
  IssueCommentPayload,
  IssuesPayload,
  PullRequestPayload,
  PullRequestReviewCommentPayload,
} from "../types/github"

const actionablePrActions = new Set(["opened", "reopened", "ready_for_review", "synchronize", "edited"])
const actionableIssueActions = new Set(["opened", "reopened", "edited"])
const actionableCommentActions = new Set(["created", "edited"])

export const shouldReviewPullRequest = (payload: PullRequestPayload) =>
  actionablePrActions.has(payload.action) && payload.pull_request?.base.ref === "main"

export const shouldReviewIssue = (payload: IssuesPayload) =>
  actionableIssueActions.has(payload.action) && !payload.issue?.pull_request

export const shouldReviewIssueComment = (payload: IssueCommentPayload) =>
  actionableCommentActions.has(payload.action) && Boolean(payload.issue?.pull_request)

export const shouldReviewPullRequestReviewComment = (
  payload: PullRequestReviewCommentPayload,
) => actionableCommentActions.has(payload.action)
