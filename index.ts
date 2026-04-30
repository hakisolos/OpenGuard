import app from "./app/server"
const PORT = String(process.env.PORT) || 3000

Bun.serve({
    fetch: app.fetch,
    port: PORT
})
console.log(`app running on http:s//localhost:${PORT}`)