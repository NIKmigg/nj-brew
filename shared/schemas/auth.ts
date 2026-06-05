import { z } from "zod";

const emailSchema = z.email({ error: "auth.emailInvalid" });
const passwordSchema = z
  .string()
  .min(8, { error: "auth.passwordMin" });

export const authEntrySchema = z
  .object({
    email: emailSchema,
    mode: z.enum([
      "login",
      "signup",
    ]),
    name: z.string(),
    password: passwordSchema,
  })
  .superRefine((values, ctx) => {
    if (values.mode === "signup" && !values.name.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "auth.nameRequired",
        path: ["name"],
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type AuthEntrySchema = z.infer<typeof authEntrySchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
