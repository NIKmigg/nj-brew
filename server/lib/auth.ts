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
  trustedOrigins: env.TRUSTED_ORIGINS,
  user: {
    deleteUser: {
      enabled: true,

      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: env.NODE_ENV === "development" ? env.DEV_MAILS_TO : user.email,
          subject: "NJ Brew Konto löschen",
          text: `Klicke auf den folgenden Link, um dein Konto zu löschen:

          ${url}

          Falls du die Löschung nicht angefordert hast, kannst du diese E-Mail ignorieren.`,
          html: `
          <p>Klicke auf den folgenden Link, um dein Konto zu löschen:</p>
          <p><a href="${url}">Konto löschen</a></p>
          <p>Falls du die Löschung nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
          `,
        });
      },
    },
  },
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
        to: env.NODE_ENV === "development" ? env.DEV_MAILS_TO : user.email,
        subject: "NJ Brew Passwort zurücksetzen",
        text: `Klicke auf diesen Link, um dein Passwort zurückzusetzen: ${url}`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendOnSignIn: false,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendAuthEmail({
        to: env.NODE_ENV === "development" ? env.DEV_MAILS_TO : user.email,
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
