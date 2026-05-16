import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  out: "./server/db/migrations",
  schema: "./server/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: `./data/${process.env.DB_FILE_NAME}`,
  },
});
