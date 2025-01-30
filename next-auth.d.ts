// next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

// Extend the User and Session types in NextAuth
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"]; // Extend default user properties (email, name, etc.)
  }
}
