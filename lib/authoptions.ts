// lib/authOptions.ts
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
        session.user.role = (user as User & { role?: string }).role || "user";
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
};
