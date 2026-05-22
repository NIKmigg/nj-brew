import { createClient } from "@libsql/client";
import { env } from "@server/lib/env";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({ url: env.DB_FILE_NAME! });

export const db = drizzle({ client });
