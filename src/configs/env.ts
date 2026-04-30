const splitList = (value: string | undefined) =>
  value
    ?.split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean) ?? []

const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const config = {
  appName: "OpenGuard",
  port: numberFromEnv(process.env.PORT, 3000),
  admins: splitList(process.env.ADMINS),
  githubToken: process.env.GITHUB_TOKEN ?? "",
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET ?? "",
  cohereApiKey: process.env.COHERE_API_KEY ?? "",
  cohereModel: process.env.COHERE_MODEL ?? "command-a-03-2025",
  openGuardInstructions: process.env.OPENGUARD_CUSTOM_INSTRUCTIONS ?? "",
  emailUser: process.env.EMAIL_USER ?? "",
  emailPass: process.env.EMAIL_PASS ?? "",
  smtpHost: process.env.SMTP_HOST ?? "smtp.gmail.com",
  smtpPort: numberFromEnv(process.env.SMTP_PORT, 465),
  smtpSecure: (process.env.SMTP_SECURE ?? "true") !== "false",
  eventLogPath: process.env.EVENT_LOG_PATH ?? "logs/events.jsonl",
}

export const hasAiConfig = () => Boolean(config.cohereApiKey)

export const hasGithubConfig = () => Boolean(config.githubToken)

export const hasMailConfig = () =>
  Boolean(config.emailUser && config.emailPass && config.admins.length)
