import { issuePrompt, systemPrompt } from "../ai/prompts"
import { cohereJson } from "../services/cohere"
import { createIssueComment } from "../services/github"
import { sendAdminMail } from "../utils/mails"
import type { IssuesPayload } from "../types/github"
import type { AiIssueResponse } from "../types/review"

const fallbackIssueResponse = (title: string): AiIssueResponse => ({
  sentiment: "needs_clarification",
  publicReply: `OpenGuard could not complete an AI triage for "${title}". Please provide clear reproduction details, expected behavior, actual behavior, and any relevant logs.`,
  adminSummary: `OpenGuard could not complete AI triage for "${title}". Manual review is required.`,
})

export const handleIssueEvent = async (payload: IssuesPayload) => {
  const repo = payload.repository.full_name
  const issue = payload.issue
  const response = await cohereJson<AiIssueResponse>(
    [
      { role: "system", content: systemPrompt() },
      { role: "user", content: issuePrompt(issue) },
    ],
    fallbackIssueResponse(issue.title),
  )

  await Promise.all([
    createIssueComment(repo, issue.number, response.publicReply),
    sendAdminMail(
      `OpenGuard issue ${repo}#${issue.number}: ${response.sentiment}`,
      [
        `Repository: ${repo}`,
        `Issue: #${issue.number} ${issue.title}`,
        `Action: ${payload.action}`,
        `Author: ${issue.user.login}`,
        `URL: ${issue.html_url}`,
        "",
        response.adminSummary,
      ].join("\n"),
    ),
  ])
}
