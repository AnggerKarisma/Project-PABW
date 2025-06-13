"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Asumsi Anda punya komponen Button dari shadcn/ui atau kustom
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Sesuaikan path jika perlu
import { useRouter } from "next/navigation"; // Meskipun tidak redirect langsung, bisa berguna

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter(); // Bisa digunakan jika ingin navigasi setelah aksi tertentu

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    // Validasi email sederhana (opsional, Supabase juga akan memvalidasi)
    if (!email) {
      setError("Alamat email tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    try {
      // Tentukan URL redirect SETELAH pengguna mengklik link di email.
      // Ini adalah halaman di aplikasi Anda tempat pengguna akan memasukkan password baru.
      // Pastikan URL ini terdaftar di Supabase Dashboard > Authentication > URL Configuration > Redirect URLs.
      const redirectTo = `${window.location.origin}/update-password`; // Contoh URL

      const { error: supabaseError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo,
        });

      if (supabaseError) {
        throw supabaseError;
      }

      setMessage(
        "Jika akun dengan email tersebut ada, kami telah mengirimkan tautan untuk mengatur ulang kata sandi Anda. Silakan periksa kotak masuk Anda (dan folder spam)."
      );
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(
        err.message ||
          "Terjadi kesalahan. Pastikan email Anda benar dan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          LUPA KATA SANDI
        </h2>

        {message && (
          <div className="bg-green-50 dark:bg-green-700 dark:text-green-100 border border-green-300 dark:border-green-600 text-green-700 p-3 rounded-md text-sm mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-700 dark:text-red-100 border border-red-300 dark:border-red-600 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        {!message && ( // Hanya tampilkan form jika belum ada pesan sukses
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-center text-sm">
              Masukkan alamat email yang terkait dengan akun Anda. Kami akan
              mengirimkan tautan untuk mengatur ulang kata sandi.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Alamat Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="email@anda.com"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button // Menggunakan komponen Button Anda
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Mengirim..." : "Kirim Tautan Atur Ulang"}
              </Button>
            </form>
          </>
        )}
        <p className="text-center mt-6 text-sm">
          <a
            href="/sign-in"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Kembali ke Halaman Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
