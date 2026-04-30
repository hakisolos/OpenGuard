export type ReviewDecision = "approve" | "comment" | "request_changes"

export type AiReview = {
  decision: ReviewDecision
  title: string
  body: string
  adminSummary: string
}

export type AiIssueResponse = {
  sentiment: "positive" | "needs_clarification" | "invalid"
  publicReply: string
  adminSummary: string
}
