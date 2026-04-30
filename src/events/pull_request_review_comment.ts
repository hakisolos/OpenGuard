import { prCommentPrompt, systemPrompt } from "../ai/prompts"
import { cohereJson } from "../services/cohere"
import { createPullRequestReview, fetchPullRequestDiff } from "../services/github"
import { sendAdminMail } from "../utils/mails"
import type { PullRequestReviewCommentPayload } from "../types/github"
import type { AiReview } from "../types/review"

const fallbackReview = (title: string): AiReview => ({
  decision: "comment",
  title: "OpenGuard inline comment review unavailable",
  body: `OpenGuard could not complete an AI review for the latest inline discussion on "${title}". Please review the pull request manually before merging.`,
  adminSummary: `OpenGuard could not complete AI review for the latest inline discussion on "${title}". Manual review is required.`,
})

const reviewBody = (review: AiReview) => [`OpenGuard: ${review.title}`, "", review.body].join("\n")

export const handlePullRequestReviewCommentEvent = async (
  payload: PullRequestReviewCommentPayload,
) => {
  const repo = payload.repository.full_name
  const pullRequest = payload.pull_request
  const diff = await fetchPullRequestDiff(repo, pullRequest.number)
  const review = await cohereJson<AiReview>(
    [
      { role: "system", content: systemPrompt() },
      { role: "user", content: prCommentPrompt(pullRequest, payload.comment.body ?? "", diff) },
    ],
    fallbackReview(pullRequest.title),
  )

  await Promise.all([
    createPullRequestReview(repo, pullRequest.number, review.decision, reviewBody(review)),
    sendAdminMail(
      `OpenGuard inline PR comment ${repo}#${pullRequest.number}: ${review.title}`,
      [
        `Repository: ${repo}`,
        `Pull request: #${pullRequest.number} ${pullRequest.title}`,
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
