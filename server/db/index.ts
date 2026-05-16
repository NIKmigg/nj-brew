import { Database } from "@tursodatabase/database";
import { drizzle } from "drizzle-orm/tursodatabase/database";
import { env } from "../lib/env";

const client = new Database(env.DB_FILE_NAME!);

export const db = drizzle({ client });
