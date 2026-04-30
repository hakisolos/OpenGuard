import { describe, expect, test } from "bun:test"
import { issuePrompt, pullRequestPrompt, systemPrompt } from "../src/ai/prompts"
import type { Issue, PullRequest } from "../src/types/github"

const sender = { login: "alice", html_url: "https://github.com/alice" }

const pullRequest: PullRequest = {
  number: 7,
  title: "Add payment flow",
  body: "Adds payment handling",
  html_url: "https://github.com/owner/repo/pull/7",
  diff_url: "https://github.com/owner/repo/pull/7.diff",
  base: { ref: "main" },
  head: { ref: "payments", sha: "abc" },
  user: sender,
}

const issue: Issue = {
  number: 9,
  title: "Checkout fails",
  body: "The checkout page returns 500",
  html_url: "https://github.com/owner/repo/issues/9",
  user: sender,
}

describe("ai prompts", () => {
  test("system prompt names OpenGuard and keeps a serious style", () => {
    const prompt = systemPrompt()

    expect(prompt).toContain("OpenGuard")
    expect(prompt).toContain("Do not use emojis")
  })

  test("pull request prompt requests structured review json", () => {
    const prompt = pullRequestPrompt(pullRequest, "diff --git a/file.ts b/file.ts")

    expect(prompt).toContain('"decision":"approve|comment|request_changes"')
    expect(prompt).toContain("Add payment flow")
  })

  test("issue prompt requests structured triage json", () => {
    const prompt = issuePrompt(issue)

    expect(prompt).toContain('"sentiment":"positive|needs_clarification|invalid"')
    expect(prompt).toContain("Checkout fails")
  })
})
