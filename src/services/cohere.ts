import { config, hasAiConfig } from "../configs/env"

type CohereMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

type CohereResponse = {
  message?: {
    content?: Array<{
      type: string
      text: string
    }>
  }
}

export const cohereChat = async (messages: CohereMessage[]) => {
  if (!hasAiConfig()) {
    throw new Error("COHERE_API_KEY is required for AI review")
  }

  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.cohereApiKey}`,
      "Content-Type": "application/json",
      "X-Client-Name": "OpenGuard",
    },
    body: JSON.stringify({
      model: config.cohereModel,
      messages,
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    throw new Error(`Cohere request failed with ${response.status}`)
  }

  const data = (await response.json()) as CohereResponse
  const text = data.message?.content?.find((item) => item.type === "text")?.text

  if (!text) {
    throw new Error("Cohere returned no text")
  }

  return text
}

export const cohereJson = async <T>(messages: CohereMessage[], fallback: T) => {
  try {
    return JSON.parse(await cohereChat(messages)) as T
  } catch {
    return fallback
  }
}
