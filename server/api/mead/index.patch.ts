import { updateMeadConstants } from "~~/server/db/queries/mead";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const result = await readValidatedBody(event, insertProductSchema.safeParse);

  return updateMeadConstants();
});
