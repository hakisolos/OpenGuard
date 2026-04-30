import { handleIssueCommentEvent } from "./issue_comment"
import { handleIssueEvent } from "./issues"
import { handlePullRequestEvent } from "./pull_request"
import { handlePullRequestReviewCommentEvent } from "./pull_request_review_comment"
import { handlePushEvent } from "./push"
import {
  shouldReviewIssue,
  shouldReviewIssueComment,
  shouldReviewPullRequest,
  shouldReviewPullRequestReviewComment,
} from "./routing"
import type {
  IssueCommentPayload,
  IssuesPayload,
  PullRequestPayload,
  PullRequestReviewCommentPayload,
  PushPayload,
  WebhookPayload,
} from "../types/github"

export const dispatchGithubEvent = async (event: string | undefined, payload: WebhookPayload) => {
  if (event === "pull_request") {
    const data = payload as PullRequestPayload

    if (!shouldReviewPullRequest(data)) {
      return
    }

    await handlePullRequestEvent(data)
    return
  }

  if (event === "issues") {
    const data = payload as IssuesPayload

    if (!shouldReviewIssue(data)) {
      return
    }

    await handleIssueEvent(data)
    return
  }

  if (event === "issue_comment") {
    const data = payload as IssueCommentPayload

    if (!shouldReviewIssueComment(data)) {
      return
    }

    await handleIssueCommentEvent(data)
    return
  }

  if (event === "pull_request_review_comment") {
    const data = payload as PullRequestReviewCommentPayload

    if (!shouldReviewPullRequestReviewComment(data)) {
      return
    }

    await handlePullRequestReviewCommentEvent(data)
    return
  }

  if (event === "push") {
    await handlePushEvent(payload as PushPayload)
  }
}
