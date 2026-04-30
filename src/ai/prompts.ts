import { config } from "../configs/env"
import type { Issue, PullRequest } from "../types/github"
import { compact, lines, truncate } from "../utils/text"

export const systemPrompt = () =>
  lines([
    "You are OpenGuard, a professional open-source repository safety reviewer.",
    "Write with a serious, concise, security-aware tone.",
    "Do not use emojis.",
    "Do not use jokes, slang, or casual filler.",
    "Focus on correctness, maintainability, secure coding habits, malicious behavior, risky changes, and obvious mistakes.",
    "When evidence is limited, say so clearly and avoid inventing facts.",
    config.openGuardInstructions && `Additional project instructions: ${config.openGuardInstructions}`,
  ])

export const pullRequestPrompt = (pullRequest: PullRequest, diff: string) =>
  lines([
    "Generate a JSON object for a GitHub pull request review.",
    'The JSON shape must be {"decision":"approve|comment|request_changes","title":"string","body":"string","adminSummary":"string"}.',
    'Use "request_changes" only for concrete correctness, security, maliciousness, or maintainability issues that should block merging.',
    'Use "approve" only when the diff looks safe and disciplined.',
    'Use "comment" for limited context, minor concerns, or mixed findings.',
    `Pull request: #${pullRequest.number} ${pullRequest.title}`,
    `Author: ${pullRequest.user.login}`,
    `Base branch: ${pullRequest.base.ref}`,
    `Head branch: ${pullRequest.head.ref}`,
    `Description: ${compact(pullRequest.body)}`,
    `Diff:\n${truncate(diff, 55000)}`,
  ])

export const issuePrompt = (issue: Issue) =>
  lines([
    "Generate a JSON object for a GitHub issue response.",
    'The JSON shape must be {"sentiment":"positive|needs_clarification|invalid","publicReply":"string","adminSummary":"string"}.',
    "If the issue is useful, acknowledge it professionally and suggest the next useful step.",
    "If it is unclear, ask for the missing details without being rude.",
    "If it appears nonsensical, abusive, spammy, or impossible to act on, ask the author to provide a meaningful report.",
    `Issue: #${issue.number} ${issue.title}`,
    `Author: ${issue.user.login}`,
    `Body: ${compact(issue.body)}`,
  ])

export const prCommentPrompt = (pullRequest: PullRequest, commentBody: string, diff: string) =>
  lines([
    "Generate a JSON object for a GitHub pull request review after a new PR comment.",
    'The JSON shape must be {"decision":"approve|comment|request_changes","title":"string","body":"string","adminSummary":"string"}.',
    "Review the latest comment in the context of the pull request and diff.",
    `Pull request: #${pullRequest.number} ${pullRequest.title}`,
    `Author: ${pullRequest.user.login}`,
    `Latest comment: ${compact(commentBody)}`,
    `Description: ${compact(pullRequest.body)}`,
    `Diff:\n${truncate(diff, 55000)}`,
  ])
