import { updateMeadConstants } from "@server/db/queries/mead";
import { updateMeadConstantsSchema } from "@shared/schemas/mead";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const result = await readValidatedBody(event, updateMeadConstantsSchema.safeParse);

  return updateMeadConstants(result.success ? result.data : {});
});
