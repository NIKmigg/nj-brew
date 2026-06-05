import nodemailer from "nodemailer";
import { env } from "./env";

type AuthEmail = {
  html?: string;
  subject: string;
  text: string;
  to: string;
};

const transporter = nodemailer.createTransport({
  auth: {
    pass: env.SMTP_PASS,
    user: env.SMTP_USER,
  },
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
});

export async function sendEmail(email: AuthEmail) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    html: email.html,
    subject: email.subject,
    text: email.text,
    to: email.to,
  });
}
