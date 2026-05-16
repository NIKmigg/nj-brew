import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),
  DB_FILE_NAME: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
