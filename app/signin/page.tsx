"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface SignInForm {
  email: string;
}

const SignInPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInForm>();
  const email = watch("email");
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  const onSubmit = async (data: SignInForm) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: "/",
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
        toast.success("Magic link has been sent! Check your email.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4 sm:px-6">
      {!emailSent ? (
        <Card className="border rounded-lg p-4 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-lg sm:text-xl">
              Sign In / Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
              Enter your email address to sign in or create an account.
              We&apos;ll email you a magic link to sign in.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  aria-invalid={errors.email ? "true" : "false"}
                  className="text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-sm sm:text-base"
                disabled={loading}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignInPage;
