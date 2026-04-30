import { Hono } from "hono";
import { existsSync, readFileSync, writeFileSync } from "node:fs";


const app = new Hono()
const PORT = String(process.env.PORT) || 3000

//  events tacker :
if (!existsSync("events.json")) {
    writeFileSync("events.json", "[]")
}
// receive Github Webhook

app.post("/github/webhook", async (c) => {
    try {
        const event = c.req.header("x-github-event")
        console.log(`Event Detected: ${event}`)
        const payload = await c.req.json()
        //store events
        const eventsDB: Array<any> = JSON.parse(readFileSync("events.json", 'utf-8'))
        eventsDB.push(payload)
        writeFileSync("events.json", JSON.stringify(eventsDB))
    }catch(e){
        console.log(e)
        return c.json(`an error occured: ${e}`,200)
    }
})
Bun.serve({
    fetch: app.fetch,
    port: PORT
})
console.log(`app running on http://localhost:${PORT}`)
