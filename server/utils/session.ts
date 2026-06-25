import type { H3Event } from "h3";
import { auth } from "@server/lib/auth";

export async function requireUserSession(event: H3Event) {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Nicht angemeldet" });
  }

  return session;
}
