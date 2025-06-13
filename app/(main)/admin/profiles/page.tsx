"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
// import { Button } from "@/components/ui/button"; // Jika Anda ingin menggunakan Button shadcn untuk Tambah Pengguna
// Di bagian atas file AdminProfilesPage.tsx
import UserAvatar from "@/components/account/UserAvatar";
// Definisikan tipe untuk Profile
type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  user_role?: "Admin" | "courier" | "user" | null;
  created_at?: string; // atau Date
};

const PROFILES_PER_PAGE = 10; // Konstanta bisa di luar komponen

const AdminProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);

  const supabase = createClient();

  const fetchProfiles = useCallback(
    async (page: number, search: string) => {
      setLoading(true);
      setError(null);

      try {
        const from = (page - 1) * PROFILES_PER_PAGE;
        const to = from + PROFILES_PER_PAGE - 1;

        let query = supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url, user_role, created_at", {
            count: "exact",
          })
          .order("created_at", { ascending: false }) // Pastikan kolom created_at ada atau ganti
          .range(from, to);

        if (search.trim()) {
          // Hanya filter jika search term tidak kosong
          query = query.ilike("full_name", `%${search.trim()}%`);
        }

        const { data, error: dbError, count } = await query;

        if (dbError) throw dbError;

        setProfiles(data || []);
        setTotalProfiles(count || 0);
      } catch (err: any) {
        console.error("Error fetching profiles:", err);
        setError(err.message || "Gagal memuat data profil.");
        setProfiles([]);
        setTotalProfiles(0);
      } finally {
        setLoading(false);
      }
    },
    [supabase] // PROFILES_PER_PAGE adalah konstanta, jadi tidak perlu di sini
    // Jika PROFILES_PER_PAGE adalah state/prop, maka perlu dimasukkan
  );

  useEffect(() => {
    fetchProfiles(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchProfiles]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Jika halaman saat ini bukan 1, mengubahnya akan memicu useEffect.
    // Jika sudah 1, dan searchTerm di state sama dengan di input (karena onchange),
    // fetch mungkin tidak terpicu jika searchTerm tidak dianggap berubah.
    // Untuk memastikan fetch terjadi saat submit dengan search term yang mungkin sama:
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // Jika sudah di halaman 1, panggil fetch secara manual
      // untuk kasus di mana searchTerm tidak berubah tapi user tetap klik search.
      // Atau jika Anda ingin fetch ulang walau searchTerm sama.
      fetchProfiles(1, searchTerm);
    }
  };

  const totalPages = Math.ceil(totalProfiles / PROFILES_PER_PAGE);

  return (
    <section className="max-w-screen-xl mx-auto py-8 px-4 md:px-6">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Manajemen Profil Pengguna
          </h1>
          {/* Contoh Tombol Tambah Pengguna
          <Link href="/admin/profiles/create"> 
            <Button>Tambah Pengguna</Button>
          </Link>
          */}
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cari
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-3 dark:text-gray-300">Memuat profil...</p>
          </div>
        )}
        {error && (
          <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
            Error: {error}
          </p>
        )}

        {!loading && !error && profiles.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            Tidak ada profil pengguna yang ditemukan.
          </p>
        )}

        {!loading && !error && profiles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Avatar
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Nama Lengkap
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserAvatar
                        name={profile.full_name || "Pengguna"}
                        avatarUrl={profile.avatar_url || undefined}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {profile.full_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {profile.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.user_role === "Admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                            : profile.user_role === "courier"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                            : "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                        }`}
                      >
                        {profile.user_role || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/profiles/edit/${profile.id}`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-2 rounded-md border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        Ubah Profil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalProfiles > PROFILES_PER_PAGE && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-md disabled:opacity-50 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sebelumnya
            </button>
            <span className="dark:text-gray-300 text-sm">
              Halaman {currentPage} dari {totalPages} (Total: {totalProfiles}{" "}
              profil)
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md disabled:opacity-50 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProfilesPage;
