"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";

interface SignInForm {
  email: string;
}

const SignInPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInForm>();
  const email = watch("email");
  const { status } = useSession();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/register" });
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/register" });
  };

  const handleDiscordSignIn = () => {
    signIn("discord", { callbackUrl: "/register" });
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/register");
    }
  }, [status, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emailSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [emailSent, resendTimer]);

  const sendMagicLink = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/register",
      });
      if (result?.error) {
        setError(
          "An error occurred while sending the email. Please try again."
        );
        toast.error(
          "An error occurred while sending the email. Please try again."
        );
      } else {
        setEmailSent(true);
        setResendTimer(60); // Reset the timer
        toast.success("Magic link has been sent! Check your email.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SignInForm) => {
    await sendMagicLink(data.email);
  };

  const handleResend = async () => {
    if (email && resendTimer === 0) {
      await sendMagicLink(email);
    } else {
      setError("Please wait before resending the magic link.");
    }
  };

  const handleChangeEmail = () => {
    setEmailSent(false);
    setError(null);
  };

  if (status === "loading") {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4 sm:px-6">
      {!emailSent ? (
        <Card className="border rounded-lg p-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-center text-lg sm:text-xl">
              Sign In or Sign Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
              Continue to your account or create a new one in seconds.
            </p>

            {/* Google, Discord, GitHub Sign-In Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <Button
                className="w-full flex items-center justify-center gap-2 py-3 text-sm sm:text-base  text-white rounded-md transition hover:shadow-lg"
                style={{ backgroundColor: "#4285F4" }}
                onClick={handleGoogleSignIn}
              >
                <IconBrandGoogleFilled className="h-5 w-5" />
                Continue with Google
              </Button>

              <Button
                className="w-full flex items-center justify-center gap-2 py-3 text-sm sm:text-base  text-white rounded-md transition hover:shadow-lg"
                style={{ backgroundColor: "#5865F2" }}
                onClick={handleDiscordSignIn}
              >
                <IconBrandDiscordFilled className="h-5 w-5" />
                Continue with Discord
              </Button>

              <Button
                className="w-full flex items-center justify-center gap-2 py-3 text-sm sm:text-base  text-white rounded-md transition hover:shadow-lg"
                style={{ backgroundColor: "#24292E" }}
                onClick={handleGitHubSignIn}
              >
                <IconBrandGithubFilled className="h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>

            <div className="flex items-center justify-center mb-6">
              <hr className="w-1/3 border-gray-300" />
              <p className="mx-2 text-gray-400 text-sm">or</p>
              <hr className="w-1/3 border-gray-300" />
            </div>

            {/* Email Sign-In Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1 text-gray-700"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  aria-invalid={errors.email ? "true" : "false"}
                  className="w-full text-sm sm:text-base px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition hover:shadow-md"
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>

            {error && (
              <p className="text-red-500 text-center text-xs sm:text-sm mt-4">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border rounded-lg p-4 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-lg sm:text-xl">
              Check Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-sm sm:text-base">
              We have sent a magic link to <strong>{email}</strong>.
            </p>
            <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
              Please check your inbox and click the link to sign in.
            </p>
            <div className="flex justify-center mt-6 gap-4">
              <Button
                onClick={handleResend}
                className="py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md transition hover:shadow-md"
                disabled={loading || resendTimer > 0}
              >
                {loading
                  ? "Resending..."
                  : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend Link"}
              </Button>
              <Button
                onClick={handleChangeEmail}
                variant="outline"
                className="py-3 text-sm sm:text-base border-gray-300 rounded-md text-gray-700 hover:border-gray-400 hover:text-gray-900 transition"
              >
                Change Email
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-center text-xs sm:text-sm mt-4">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignInPage;
