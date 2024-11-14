// /app/components/AuthButtons.tsx

"use client"; // This is a client component

import { signIn, signOut } from "next-auth/react";

type AuthButtonsProps = {
  isAuthenticated: boolean;
};

export default function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  return (
    <div className="auth-container">
      {isAuthenticated ? (
        <button className="button text-red-400" onClick={() => signOut()}>
          Sign out
        </button>
      ) : (
        <button className="button" onClick={() => signIn()}>
          Sign in
        </button>
      )}
    </div>
  );
}
