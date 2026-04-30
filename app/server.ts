import { Hono } from "hono"
import webhook from "./webhook"

const app = new Hono()

app.route("/webhook", webhook)

app.get("/", (c) => c.json({ name: "OpenGuard", status: "ok" }))

export default app
