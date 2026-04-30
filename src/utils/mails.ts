import { config, hasMailConfig } from "../configs/env"
import { transporter } from "../configs/nodemailer"

export const sendMail = async (recipient: string, subject: string, text: string) => {
  if (!hasMailConfig() || !recipient || !subject || !text) {
    return false
  }

  try {
    await transporter.sendMail({
      from: `"OpenGuard" <${config.emailUser}>`,
      to: recipient.trim(),
      subject: subject.trim(),
      text: text.trim(),
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : "email delivery failed")
    return false
  }

  return true
}

export const sendAdminMail = async (subject: string, text: string) => {
  if (!hasMailConfig()) {
    return []
  }

  return Promise.all(config.admins.map((admin) => sendMail(admin, subject, text)))
}

export default sendMail
