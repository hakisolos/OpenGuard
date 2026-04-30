import { createHmac, timingSafeEqual } from "node:crypto"
import { Hono } from "hono"
import { config } from "../src/configs/env"
import { dispatchGithubEvent } from "../src/events"
import { logEvent } from "../src/services/event-log"

const webhook = new Hono()

const verifySignature = async (body: string, signature: string | undefined) => {
  if (!config.githubWebhookSecret) {
    return true
  }

  if (!signature?.startsWith("sha256=")) {
    return false
  }

  const digest = `sha256=${createHmac("sha256", config.githubWebhookSecret).update(body).digest("hex")}`
  const expected = Buffer.from(digest)
  const received = Buffer.from(signature)

  return expected.length === received.length && timingSafeEqual(expected, received)
}

webhook.post("/github", async (c) => {
  const event = c.req.header("x-github-event")
  const signature = c.req.header("x-hub-signature-256")
  const body = await c.req.text()
  const verified = await verifySignature(body, signature)

  if (!verified) {
    return c.json({ error: "invalid signature" }, 401)
  }

  try {
    const payload = JSON.parse(body)
    await logEvent(event, payload)
    await dispatchGithubEvent(event, payload)

    return c.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown webhook error"
    console.error(message)

    return c.json({ error: message }, 500)
  }
})

export default webhook
