import { z } from "zod";

export const toastSchema = z.object({
  id: z.string(),
  message: z.string(),
  duration: z.number(),
  revision: z.number(),
  type: z.enum([
    "success",
    "error",
    "warning",
    "info",
  ]),
});

export type Toast = z.infer<typeof toastSchema>;
export type ToastType = Toast["type"];
