import nodemailer from "nodemailer"
import { config } from "./env"

export const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpSecure,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
})
