"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Define Zod schema for form validation
const signInSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi harus minimal 6 karakter"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // User authenticated successfully
      router.refresh();
      router.push("/"); // Redirect to dashboard or home page
    } catch (error: any) {
      setAuthError(
        error.message || "Gagal masuk. Silakan periksa kredensial Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // Google OAuth will handle the redirect
    } catch (error: any) {
      setAuthError(error.message || "Gagal masuk dengan Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="text-sm text-gray-500">
          Masuk untuk melanjutkan ke akun Anda
        </p>
      </div>

      {authError && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contoh@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Kata Sandi</Label>
            <Link
              href="/lupa-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Lupa kata sandi?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-300 w-full"></div>
        <span className="bg-white px-2 text-sm text-gray-500 absolute">
          atau
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <FaGoogle />
        <span>Masuk dengan Google</span>
      </Button>

      <p className="text-center text-sm">
        Belum punya akun?{" "}
        <Link href="/daftar" className="text-blue-600 hover:underline">
          Daftar disini
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
