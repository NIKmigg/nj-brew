import { db } from "@server/db/index";
import * as schema from "@server/db/schema/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { sendEmail } from "./email";
import { env } from "./env";

function sendAuthEmail(email: Parameters<typeof sendEmail>[0]) {
  void sendEmail(email).catch((error: unknown) => {
    console.error("Failed to send auth email", error);
  });
}

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
      ...coreFields,
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
      ...additionalFields,
      id,
    }),
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      sendAuthEmail({
        to: user.email,
        subject: "NJ Brew Passwort zurücksetzen",
        text: `Klicke auf diesen Link, um dein Passwort zurückzusetzen: ${url}`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendAuthEmail({
        to: user.email,
        subject: "NJ Brew E-Mail-Adresse bestätigen",
        text: `Klicke auf diesen Link, um deine E-Mail-Adresse zu bestätigen: ${url}`,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    admin(),
  ],
});
