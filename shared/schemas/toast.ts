import { z } from "zod";

export const toastSchema = z.object({
  id: z.string(),
  message: z.string(),
  type: z.enum([
    "success",
    "error",
    "warning",
    "info",
  ]),
});

export type Toast = z.infer<typeof toastSchema>;
export type ToastType = Toast["type"];
