import { Hono } from "hono";
import { existsSync, readFileSync, writeFileSync } from "node:fs";


const webhook = new Hono()


//  events tacker :
if (!existsSync("events.json")) {
    writeFileSync("events.json", "[]")
}
// receive Github Webhook

webhook.post("/github", async (c) => {
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

export default webhook
