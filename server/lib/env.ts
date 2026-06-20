import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),
  DB_FILE_NAME: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .string()
    .transform(value => value === "true"),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  MAIL_FROM: z.string(),
  TRUSTED_ORIGINS: z.string().transform(value => value.split(",").map(origin => origin.trim()).filter(Boolean)),
  DEV_MAILS_TO: z.string(),
  NUXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
});

export type EnvSchema = z.infer<typeof envSchema>;

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
