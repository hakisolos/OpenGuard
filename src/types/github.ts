export type Repository = {
  name: string
  full_name: string
  html_url: string
  owner: {
    login: string
  }
}

export type Sender = {
  login: string
  html_url: string
}

export type PullRequest = {
  number: number
  title: string
  body: string | null
  html_url: string
  diff_url: string
  changed_files?: number
  additions?: number
  deletions?: number
  base: {
    ref: string
  }
  head: {
    ref: string
    sha: string
  }
  user: Sender
}

export type Issue = {
  number: number
  title: string
  body: string | null
  html_url: string
  user: Sender
  pull_request?: unknown
}

export type Comment = {
  body: string | null
  html_url: string
  user: Sender
}

export type Commit = {
  id: string
  message: string
  url: string
  author?: {
    name?: string
    email?: string
    username?: string
  }
}

export type PullRequestPayload = {
  action: string
  repository: Repository
  sender: Sender
  pull_request: PullRequest
}

export type IssuesPayload = {
  action: string
  repository: Repository
  sender: Sender
  issue: Issue
}

export type IssueCommentPayload = {
  action: string
  repository: Repository
  sender: Sender
  issue: Issue
  comment: Comment
}

export type PullRequestReviewCommentPayload = {
  action: string
  repository: Repository
  sender: Sender
  pull_request: PullRequest
  comment: Comment
}

export type PushPayload = {
  ref: string
  before: string
  after: string
  repository: Repository
  sender: Sender
  commits: Commit[]
  compare: string
  pusher: {
    name: string
    email: string
  }
}

export type WebhookPayload =
  | PullRequestPayload
  | IssuesPayload
  | IssueCommentPayload
  | PullRequestReviewCommentPayload
  | PushPayload
  | Record<string, unknown>
