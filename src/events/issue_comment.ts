import { prCommentPrompt, systemPrompt } from "../ai/prompts"
import { cohereJson } from "../services/cohere"
import { createPullRequestReview, fetchPullRequest, fetchPullRequestDiff } from "../services/github"
import { sendAdminMail } from "../utils/mails"
import type { IssueCommentPayload } from "../types/github"
import type { AiReview } from "../types/review"

const fallbackReview = (title: string): AiReview => ({
  decision: "comment",
  title: "OpenGuard comment review unavailable",
  body: `OpenGuard could not complete an AI review for the latest discussion on "${title}". Please review the pull request manually before merging.`,
  adminSummary: `OpenGuard could not complete AI review for the latest discussion on "${title}". Manual review is required.`,
})

const reviewBody = (review: AiReview) => [`OpenGuard: ${review.title}`, "", review.body].join("\n")

export const handleIssueCommentEvent = async (payload: IssueCommentPayload) => {
  if (!payload.issue.pull_request) {
    return
  }

  const repo = payload.repository.full_name
  const pullNumber = payload.issue.number
  const [pullRequest, diff] = await Promise.all([
    fetchPullRequest(repo, pullNumber),
    fetchPullRequestDiff(repo, pullNumber),
  ])
  const review = await cohereJson<AiReview>(
    [
      { role: "system", content: systemPrompt() },
      { role: "user", content: prCommentPrompt(pullRequest, payload.comment.body ?? "", diff) },
    ],
    fallbackReview(pullRequest.title),
  )

  await Promise.all([
    createPullRequestReview(repo, pullNumber, review.decision, reviewBody(review)),
    sendAdminMail(
      `OpenGuard PR comment ${repo}#${pullNumber}: ${review.title}`,
      [
        `Repository: ${repo}`,
        `Pull request: #${pullNumber} ${pullRequest.title}`,
        `Action: ${payload.action}`,
        `Comment author: ${payload.comment.user.login}`,
        `Comment URL: ${payload.comment.html_url}`,
        `Decision: ${review.decision}`,
        "",
        review.adminSummary,
      ].join("\n"),
    ),
  ])
}
