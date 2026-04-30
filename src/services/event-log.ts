import { mkdir, appendFile } from "node:fs/promises"
import { dirname } from "node:path"
import { config } from "../configs/env"

export const logEvent = async (event: string | undefined, payload: unknown) => {
  await mkdir(dirname(config.eventLogPath), { recursive: true })
  await appendFile(
    config.eventLogPath,
    `${JSON.stringify({ event, receivedAt: new Date().toISOString(), payload })}\n`,
  )
}
