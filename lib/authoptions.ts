import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma";
import nodemailer from "nodemailer";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";
import { htmlTemplate } from "@/utils/htmltemplate";

const transporter = nodemailer.createTransport(
  process.env.MAILGUN_EMAIL_SERVER
);

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.MAILGUN_EMAIL_SERVER,
      from: "HackKU <auth@hackku.org>",
      maxAge: 5 * 60, // Token expires after 5 minutes
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);

        // Randomized elements
        const messages = [
          "Click the button below to sign in:",
          "Here is your secure sign-in link:",
          "Access your HackKU account by clicking below:",
          "To continue, click the sign-in button:",
        ];
        const subjects = [
          "Your HackKU Sign-in Link 🔑",
          "Secure Login for HackKU",
          "Sign in to HackKU Now",
          "Your HackKU Access Link",
        ];

        const timestamp = new Date().toLocaleString("en-US", {
          timeZone: "America/Chicago",
        });
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        const randomSubject =
          subjects[Math.floor(Math.random() * subjects.length)];
        const randomizedUrl = `${url}&t=${Date.now()}`; // Adds slight variation to the URL

        try {
          await transporter.sendMail({
            to: identifier,
            from: provider.from,
            subject: randomSubject,
            html: htmlTemplate(randomizedUrl, host, randomMessage, timestamp),
          });
          console.log("✅ Email sent to:", identifier);
        } catch (error) {
          console.error("❌ Error sending email:", error);
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
    async signIn({ account, profile, user }) {
      console.log("🔍 signIn callback triggered with:", {
        account,
        profile,
        user,
      });

      if (!account) return true; // Continue if no account

      if (account.provider !== "email") {
        const userEmail = user.email ?? profile?.email;
        if (!userEmail || typeof userEmail !== "string") return false;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userEmail },
          include: { accounts: true },
        });

        if (existingUser) {
          // Check if OAuth is already linked
          const linkedAccount = existingUser.accounts.find(
            (acc) => acc.provider === account.provider
          );

          if (!linkedAccount) {
            // Link OAuth account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });

            console.log(`✅ Linked ${account.provider} to existing user`);
          }
          return true; // Allow sign-in
        }
      }

      return true; // Default allow sign-in
    },

    async session({ session }) {
      if (session.user) {
        // Attach user ID and role to the session
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, role: true },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role || "HACKER"; // Default role if undefined
        }
      }

      return session;
    },
  },

  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: "/signin",
  },
};
