import { Hono } from "hono";
import webhook from "./webhook";

const app = new Hono()

app.route("/webhook", webhook)

export default app;