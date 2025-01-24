import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma";
import nodemailer from "nodemailer";
import EmailProvider from "next-auth/providers/email";
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
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.role = (user as User & { role?: string }).role || "HACKER";
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to /register after sign-in
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/register`; // Redirect within your app
      }

      // For external URLs (safety check), fallback to /register
      return `${baseUrl}/register`;
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
