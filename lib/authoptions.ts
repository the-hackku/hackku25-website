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
        const { host } = new URL(url);
        try {
          await transporter.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Your sign-in link for HackKU`,
            html: htmlTemplate(url, host),
          });
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
    async signIn({ account, profile, user, email }) {
      console.log("🔍 signIn callback triggered with:", {
        account,
        profile,
        user,
        email,
      });

      if (!account) return true; // Continue if no account

      if (account.provider !== "email") {
        // Ensure the email exists and is a string
        const userEmail = user.email ?? profile?.email;
        if (!userEmail || typeof userEmail !== "string") return false;

        // Check if a user already exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: userEmail },
          include: { accounts: true },
        });

        if (existingUser) {
          // Ensure OAuth account is linked
          const linkedAccount = existingUser.accounts.find(
            (acc) => acc.provider === account.provider
          );

          if (!linkedAccount) {
            // If account not linked, create an OAuth account entry
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
