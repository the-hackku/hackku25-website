"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Import toast from sonner
import { useForm } from "react-hook-form";

// Create a simple form type
interface SignInForm {
  email: string;
}

const SignInPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state for manual error handling

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInForm>();

  const email = watch("email"); // Access email value for success message

  // New handleSubmit logic
  const onSubmit = async (data: SignInForm) => {
    setError(null); // Reset error state before submission
    setLoading(true); // Set loading state
    try {
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: "/", // The page to redirect after a successful sign-in
      });

      if (result?.error) {
        // Set error and display error toast
        setError(
          "An error occurred while sending the email. Please try again."
        );
        toast.error(
          "An error occurred while sending the email. Please try again."
        );
      } else {
        // Success, show success toast
        setEmailSent(true);
        toast.success("Magic link has been sent! Check your email.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

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
              Enter your email address to sign in or create an account. We'll
              email you a magic link to sign in.
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
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p> // Display error if present
            )}
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
