import { z } from "zod";

const emailSchema = z.email({ error: "auth.emailInvalid" });
const passwordSchema = z
  .string()
  .min(8, { error: "auth.passwordMin" });

export const authEntrySchema = z
  .object({
    email: emailSchema,
    mode: z.enum(["login", "signup"]),
    name: z.string(),
    password: z.string(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === "signup") {
      if (!values.name.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "auth.nameRequired",
          path: ["name"],
        });
      }

      if (values.password.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "auth.passwordMin",
          path: ["password"],
        });
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "auth.passwordsDoNotMatch",
          path: ["confirmPassword"],
        });
      }
    }
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).superRefine((values, ctx) => {
  if (values.password !== values.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "auth.passwordsDoNotMatch",
      path: ["confirmPassword"],
    });
  }
});

export type AuthEntrySchema = z.infer<typeof authEntrySchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
