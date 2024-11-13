"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

// Create a simple form type
interface SignInForm {
  email: string;
}

const SignInPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Next.js router
  const router = useRouter();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInForm>();

  const email = watch("email");

  // Get session status and user data from next-auth
  const { status } = useSession();

  // Check if the user is authenticated and redirect to /profile
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  // New handleSubmit logic
  const onSubmit = async (data: SignInForm) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: "/", // The page to redirect after a successful sign-in
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

  // Show a loading state while checking authentication
  if (status === "loading") {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container max-w-md mx-auto py-8">
      {!emailSent ? (
        <Card className="border rounded-lg p-4 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Sign In / Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Introductory Message */}
            <p className="text-center text-gray-600 mb-6">
              Enter your email address to sign in or create an account.
              We&apos;ll email you a magic link to sign in.
            </p>

            {/* Sign In Form */}
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
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Sign In with Email"}
              </Button>
            </form>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </CardContent>
        </Card>
      ) : (
        <Card className="border rounded-lg p-4 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Check Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              We have sent a magic link to <strong>{email}</strong>.
            </p>
            <p className="text-center text-gray-600 mt-2">
              Please check your inbox and click the link to sign in.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignInPage;
