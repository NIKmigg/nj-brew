import { defineConfig } from "drizzle-kit";
import { env } from "./server/lib/env";

export default defineConfig({
  out: "./server/db/migrations",
  schema: "./server/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
