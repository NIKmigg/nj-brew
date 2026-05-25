import type { H3Event } from "h3";
import { auth } from "@server/lib/auth";

export async function requireAdmin(event: H3Event) {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
    });
  }

  if (session.user.role !== "admin") {
    throw createError({
      statusCode: 403,
    });
  }

  return session;
}
