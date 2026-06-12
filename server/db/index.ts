import * as schema from "@server/db/schema";
import { env } from "@server/lib/env";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database(
  env.DB_FILE_NAME.replace("file:", ""),
);

export const db = drizzle(sqlite, {
  schema,
});
