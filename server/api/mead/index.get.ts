import { getMeadConstants } from "@server/db/queries/mead";

export default defineEventHandler(() => {
  return getMeadConstants();
});
