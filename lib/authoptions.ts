import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma";
import nodemailer from "nodemailer";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";
import { htmlTemplate } from "@/utils/htmltemplate";

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: "HackKU <auth@hackku.org>",
      maxAge: 5 * 60, // Token expires after 5 minutes
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        console.log("📨 Triggered sendVerificationRequest for:", identifier);

        const { host } = new URL(url);
        try {
          const result = await transporter.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Your sign-in link for HackKU`,
            html: htmlTemplate(url, host),
          });
          console.log("✅ Email sent:", result.messageId);
        } catch (error) {
          if (error instanceof Error) {
            console.error("❌ Error sending email:", {
              message: error.message,

              stack: error.stack,
            });
          } else {
            console.error("❌ Unexpected error:", error);
          }
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user, email, credentials }) {
      console.log("🔍 signIn callback triggered with:", {
        account,
        profile,
        user,
        email,
        credentials,
      });
      return true; // Allow sign-in
    },

    async session({ session, user }) {
      console.log("🗂️ Session callback triggered with:", { session, user });

      // Attach the role to the session
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role || "HACKER"; // Default role is HACKER if undefined
      }

      return session;
    },
  },

  adapter: {
    ...PrismaAdapter(prisma),
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { identifier_token: { identifier, token } },
      });

      if (!verificationToken) {
        return null; // Invalid token
      }

      // Check expiration
      const now = new Date();
      if (verificationToken.expires < now) {
        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: verificationToken.identifier,
              token,
            },
          },
        });
        return null; // Token expired
      }

      return verificationToken; // Allow unlimited uses within expiration
    },
  },
  pages: {
    signIn: "/signin",
  },
};
