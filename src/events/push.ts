import { sendAdminMail } from "../utils/mails"
import { truncate } from "../utils/text"
import type { PushPayload } from "../types/github"

const branchName = (ref: string) => ref.replace("refs/heads/", "")

export const handlePushEvent = async (payload: PushPayload) => {
  const repo = payload.repository.full_name
  const branch = branchName(payload.ref)
  const commits = payload.commits.slice(0, 10)
  const commitLines = commits.map((commit) => {
    const message = truncate(commit.message.replace(/\s+/g, " "), 180)
    return `- ${commit.id.slice(0, 7)} ${message}`
  })

  await sendAdminMail(
    `OpenGuard push ${repo}:${branch}`,
    [
      `Repository: ${repo}`,
      `Branch: ${branch}`,
      `Pusher: ${payload.pusher.name} <${payload.pusher.email}>`,
      `Commits: ${payload.commits.length}`,
      `Compare: ${payload.compare}`,
      "",
      ...commitLines,
    ].join("\n"),
  )
}
