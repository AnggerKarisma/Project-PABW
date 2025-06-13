"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation"; // Gunakan dari 'next/navigation' untuk App Router
import { createClient } from "@/utils/supabase/client"; // Sesuaikan path
// Anda mungkin memerlukan tipe Profile dari file types Anda
// import type { Profile } from '@/app/path/to/your/types'; // Contoh

// Definisikan tipe Profile di sini jika belum diimpor dan hanya untuk layout ini
type UserProfile = {
  id: string;
  user_role?: "Admin" | "courier" | "user" | null; // Sesuaikan dengan enum Anda
  // Tambahkan field lain jika perlu
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        // Tidak ada sesi aktif, pengguna tidak login
        console.log("AdminLayout: No session, redirecting to sign-in.");
        router.replace("/sign-in"); // Ganti dengan path halaman login Anda
        return;
      }

      // Ada sesi, cek profil untuk mendapatkan role
      const user = session.user;
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles") // Nama tabel profil Anda
          .select("user_role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error(
            "AdminLayout: Error fetching profile:",
            profileError.message
          );
          // Gagal mengambil profil, mungkin arahkan ke halaman error atau home
          router.replace("/");
          return;
        }

        if (profile && profile.user_role === "Admin") {
          console.log("AdminLayout: User is Admin, access granted.");
          setIsAuthorized(true);
        } else {
          console.log(
            "AdminLayout: User is not Admin (role: " +
              (profile ? profile.user_role : "unknown") +
              "), redirecting to home."
          );
          // Bukan admin, arahkan ke halaman utama atau halaman akses ditolak
          router.replace("/"); // Ganti dengan halaman "Akses Ditolak" jika ada
        }
      } else {
        // Seharusnya tidak terjadi jika ada sesi, tapi sebagai fallback
        console.log(
          "AdminLayout: Session exists but no user object, redirecting to sign-in."
        );
        router.replace("/sign-in");
      }
      setIsLoading(false);
    };

    checkAdminStatus();
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        {/* Anda bisa mengganti ini dengan komponen skeleton atau spinner yang lebih bagus */}
        <p className="text-lg dark:text-white animate-pulse">
          Memeriksa otorisasi admin...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    // Pengguna tidak diotorisasi.
    // Redirect seharusnya sudah terjadi dari useEffect.
    // Menampilkan null atau pesan singkat di sini adalah fallback jika redirect belum selesai.
    // Atau bisa juga komponen "Access Denied" jika Anda tidak mau redirect langsung.
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        <p className="text-lg text-red-500 dark:text-red-400">
          Anda sedang dialihkan... Akses ditolak jika Anda bukan Admin.
        </p>
      </div>
    );
  }

  // Jika loading selesai dan pengguna diotorisasi sebagai Admin
  return <>{children}</>; // Tampilkan konten halaman admin yang sebenarnya
}
