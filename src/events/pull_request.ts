import { pullRequestPrompt, systemPrompt } from "../ai/prompts"
import { cohereJson } from "../services/cohere"
import { createPullRequestReview, fetchPullRequestDiff } from "../services/github"
import { sendAdminMail } from "../utils/mails"
import type { PullRequestPayload } from "../types/github"
import type { AiReview } from "../types/review"

const fallbackReview = (title: string): AiReview => ({
  decision: "comment",
  title: "OpenGuard review unavailable",
  body: `OpenGuard could not complete an AI review for "${title}". Please review this pull request manually before merging.`,
  adminSummary: `OpenGuard could not complete an AI review for "${title}". Manual review is required.`,
})

const reviewBody = (review: AiReview) => [`OpenGuard: ${review.title}`, "", review.body].join("\n")

export const handlePullRequestEvent = async (payload: PullRequestPayload) => {
  const repo = payload.repository.full_name
  const pullRequest = payload.pull_request
  const diff = await fetchPullRequestDiff(repo, pullRequest.number)
  const review = await cohereJson<AiReview>(
    [
      { role: "system", content: systemPrompt() },
      { role: "user", content: pullRequestPrompt(pullRequest, diff) },
    ],
    fallbackReview(pullRequest.title),
  )

  await Promise.all([
    createPullRequestReview(repo, pullRequest.number, review.decision, reviewBody(review)),
    sendAdminMail(
      `OpenGuard PR ${repo}#${pullRequest.number}: ${review.title}`,
      [
        `Repository: ${repo}`,
        `Pull request: #${pullRequest.number} ${pullRequest.title}`,
        `Action: ${payload.action}`,
        `Author: ${pullRequest.user.login}`,
        `Decision: ${review.decision}`,
        `URL: ${pullRequest.html_url}`,
        "",
        review.adminSummary,
      ].join("\n"),
    ),
  ])
}
