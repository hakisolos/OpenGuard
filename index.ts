import app from "./app/server"
import { config } from "./src/configs/env"

Bun.serve({
  fetch: app.fetch,
  port: config.port,
})

console.log(`OpenGuard running on http://localhost:${config.port}`)
