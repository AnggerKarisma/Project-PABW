"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import Image from "next/image"; // Tidak perlu jika menggunakan Avatar, AvatarImage, AvatarFallback untuk pratinjau
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // <-- IMPORT INI

// ... (definisi tipe ProfileData dan userRoleOptions tetap sama) ...
type ProfileData = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  user_role?: "Admin" | "courier" | "user" | null;
  address?: string | null;
  phone?: string | null;
  city?: string | null;
  zip_code?: string | null;
};

const userRoleOptions: Array<"Admin" | "courier" | "user"> = [
  "Admin",
  "courier",
  "user",
];

// Fungsi getInitials (bisa diimpor atau didefinisikan di sini)
const getInitials = (name?: string | null): string => {
  if (!name || name.trim() === "") {
    return "P"; // Fallback default jika nama tidak ada
  }
  const words = name.trim().split(/\s+/);
  if (words.length === 1 && words[0].length > 0) {
    return words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
  }
  if (words.length > 1) {
    const firstInitial = words[0][0];
    const lastInitial = words[words.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
  }
  return "P";
};

const AdminEditProfilePage = () => {
  // ... (semua state dan fungsi (fetchProfile, handleChange, handleSubmit, dll) tetap sama) ...
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [profileData, setProfileData] = useState<Partial<ProfileData> | null>(
    null
  );
  const [initialEmail, setInitialEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from("profiles")
          .select(
            "id, email, full_name, avatar_url, website, user_role, address, phone, city, zip_code"
          )
          .eq("id", id)
          .single();

        if (dbError) throw dbError;
        if (!data) throw new Error("Profil tidak ditemukan.");

        setProfileData(data);
        setInitialEmail(data.email || null);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) =>
      prev ? { ...prev, [name]: value === "" ? null : value } : null
    );
  };

  const handleRoleChange = (value: string) => {
    setProfileData((prev) =>
      prev ? { ...prev, user_role: value as ProfileData["user_role"] } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profileData) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const { id, email, ...updateData } = profileData;

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccessMessage("Profil berhasil diperbarui!");
      fetchProfile(userId);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    // ... (return loading, error, not found tetap sama) ...
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 dark:text-gray-300">Memuat profil...</p>
      </div>
    );
  if (error && !profileData)
    return <p className="text-center text-red-500 p-8">Error: {error}</p>;
  if (!profileData)
    return (
      <p className="text-center p-8 dark:text-gray-300">
        Profil tidak ditemukan atau ID tidak valid.
      </p>
    );

  return (
    <section className="max-w-screen-md mx-auto py-8 px-4 md:px-6">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl">
        {/* ... (Judul, email, pesan error/sukses tetap sama) ... */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Edit Profil Pengguna
        </h1>
        {initialEmail && (
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Mengedit profil untuk:{" "}
            <span className="font-semibold">{initialEmail}</span>
          </p>
        )}
        {error && !loading && (
          <p className="text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md mb-4 text-sm">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-200 p-3 rounded-md mb-4 text-sm">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (Input full_name tetap sama) ... */}
          <div>
            <Label
              htmlFor="full_name"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              Nama Lengkap
            </Label>
            <Input
              type="text"
              name="full_name"
              id="full_name"
              value={profileData.full_name || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* === BAGIAN AVATAR URL YANG DIMODIFIKASI === */}
          <div>
            <Label
              htmlFor="avatar_url"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              URL Avatar
            </Label>
            <Input
              type="text"
              name="avatar_url"
              id="avatar_url"
              placeholder="https://example.com/avatar.png"
              value={profileData.avatar_url || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-2">
              <p className="text-xs dark:text-gray-400 mb-1">Pratinjau:</p>
              <Avatar className="h-20 w-20">
                {" "}
                {/* Ukuran pratinjau bisa disesuaikan */}
                <AvatarImage
                  src={profileData.avatar_url || undefined} // Berikan undefined jika kosong
                  alt={profileData.full_name || "Pratinjau Avatar"}
                />
                <AvatarFallback className="text-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {getInitials(profileData.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          {/* === AKHIR BAGIAN AVATAR URL YANG DIMODIFIKASI === */}

          {/* ... (Input website, address, phone, city, zip_code, user_role, dan tombol tetap sama) ... */}
          <div>
            <Label
              htmlFor="website"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              Website
            </Label>
            <Input
              type="text"
              name="website"
              id="website"
              placeholder="https://domainanda.com"
              value={profileData.website || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label
              htmlFor="address"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              Alamat
            </Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={profileData.address || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              Nomor Telepon
            </Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              value={profileData.phone || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label
              htmlFor="city"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              Kota
            </Label>
            <Input
              type="text"
              name="city"
              id="city"
              value={profileData.city || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label
              htmlFor="zip_code"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              Kode Pos
            </Label>
            <Input
              type="text"
              name="zip_code"
              id="zip_code"
              value={profileData.zip_code || ""}
              onChange={handleChange}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label
              htmlFor="user_role"
              className="dark:text-gray-300 block mb-1 text-sm font-medium"
            >
              User Role
            </Label>
            <Select
              value={profileData.user_role || "user"}
              onValueChange={handleRoleChange}
              disabled={saving}
            >
              <SelectTrigger className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Pilih role pengguna..." />
              </SelectTrigger>
              <SelectContent>
                {userRoleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
              className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminEditProfilePage;
