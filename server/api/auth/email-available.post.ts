import { db } from "@server/db";
import { user } from "@server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const emailAvailabilitySchema = z.object({
  email: z.email(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, emailAvailabilitySchema.parse);
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, body.email.toLowerCase()),
  });

  return {
    available: !existingUser,
  };
});
