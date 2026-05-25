import { createUniqueSlug, insertProduct } from "@server/db/queries/product";
import { requireAdmin } from "@server/utils/require-admin";
import { insertProductSchema } from "@shared/schemas/product";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const result = await readValidatedBody(event, insertProductSchema.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const slug = await createUniqueSlug(result.data.name);

  try {
    return await insertProduct(result.data, slug);
  }
  catch (error) {
    console.error("Error inserting product:", error);
    throw error;
  }
});
