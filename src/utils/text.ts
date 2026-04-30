export const compact = (value: string | null | undefined) =>
  value?.replace(/\s+/g, " ").trim() || "Not provided"

export const truncate = (value: string, limit: number) =>
  value.length <= limit ? value : `${value.slice(0, limit - 15).trim()}... [truncated]`

export const lines = (items: Array<string | false | null | undefined>) =>
  items.filter(Boolean).join("\n")
