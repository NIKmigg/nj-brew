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
          subject: "NJ Brew Konto löschen | Delete your NJ Brew account",
          text: [
            "Hallo,",
            "",
            "du hast die Löschung deines NJ Brew Kontos angefordert.",
            "",
            "Bitte bestätige die Löschung über folgenden Link:",
            url,
            "",
            "Falls du die Löschung nicht angefordert hast, kannst du diese E-Mail ignorieren.",
            "",
            "Viele Grüße",
            "dein NJ Brew Team",
            "",
            "---",
            "",
            "Hello,",
            "",
            "you requested the deletion of your NJ Brew account.",
            "",
            "Please confirm the deletion using the following link:",
            url,
            "",
            "If you did not request this deletion, you can safely ignore this email.",
            "",
            "Best regards,",
            "the NJ Brew Team",
          ].join("\n"),
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
        subject: "NJ Brew Passwort zurücksetzen | Reset your NJ Brew password",
        text: [
          "Hallo,",
          "",
          "wir haben eine Anfrage erhalten, das Passwort für dein NJ Brew Konto zurückzusetzen.",
          "",
          "Über folgenden Link kannst du ein neues Passwort festlegen:",
          url,
          "",
          "Der Link ist eine Stunde lang gültig.",
          "",
          "Falls du das Zurücksetzen nicht angefordert hast, kannst du diese E-Mail ignorieren.",
          "Dein Passwort bleibt unverändert.",
          "",
          "Viele Grüße",
          "dein NJ Brew Team",
          "",
          "---",
          "",
          "Hello,",
          "",
          "we received a request to reset the password for your NJ Brew account.",
          "",
          "You can set a new password using the following link:",
          url,
          "",
          "This link is valid for one hour.",
          "",
          "If you did not request a password reset, you can safely ignore this email.",
          "Your password will remain unchanged.",
          "",
          "Best regards,",
          "the NJ Brew Team",
        ].join("\n"),
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
        subject: "NJ Brew E-Mail-Adresse bestätigen | Confirm your NJ Brew email address",
        text: [
          "Hallo,",
          "",
          "vielen Dank für deine Registrierung bei NJ Brew.",
          "",
          "Bitte bestätige deine E-Mail-Adresse über folgenden Link:",
          url,
          "",
          "Der Link ist eine Stunde lang gültig.",
          "",
          "Falls du dich nicht bei NJ Brew registriert hast, kannst du diese E-Mail ignorieren.",
          "",
          "Viele Grüße",
          "dein NJ Brew Team",
          "",
          "---",
          "",
          "Hello,",
          "",
          "thank you for signing up for NJ Brew.",
          "",
          "Please confirm your email address using the following link:",
          url,
          "",
          "This link is valid for one hour.",
          "",
          "If you did not create an NJ Brew account, you can safely ignore this email.",
          "",
          "Best regards,",
          "the NJ Brew Team",
        ].join("\n"),
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
