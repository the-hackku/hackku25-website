import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma";
import nodemailer from "nodemailer";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions, Session, User } from "next-auth";
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
          const result = await transporter.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Your sign-in link for HackKU`,
            html: htmlTemplate(url, host),
          });
          console.log("Email sent: ", result.messageId);
        } catch (error) {
          console.error("Error sending email: ", error);
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
      const email = profile?.email;

      if (!email) {
        // Reject sign-in if no email is provided (edge case)
        return false;
      }

      try {
        // Find an existing user with the same email
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Check if the current account belongs to this user
          if (!account) {
            return false;
          }

          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            // If no account exists for this provider, link it
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          // Return the existing user (effectively merging the accounts)
          return true;
        }
      } catch (error) {
        console.error("Error linking accounts:", error);
        return false;
      }

      // Allow sign-in for new users (user not found)
      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "HACKER";
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
