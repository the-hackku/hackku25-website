import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import type { Session, User } from "next-auth";
import nodemailer from "nodemailer";
import { htmlTemplate } from "@/utils/htmltemplate";

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: "hackku <no-reply@tickget.app>",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // Define your custom email subject and body here
        const { host } = new URL(url);
        const result = await transporter.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Your sign-in link for HackKU`,
          html: htmlTemplate(url, host), // Custom HTML template function
        });
        console.log("Email sent: ", result.messageId);
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.role = user.role;
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
