"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label"; // Sesuaikan path jika perlu
import { Input } from "@/components/ui/input"; // Sesuaikan path jika perlu
import { Button } from "@/components/ui/button"; // Sesuaikan path jika perlu
import { createClient } from "@/utils/supabase/client"; // Path ke Supabase client Anda

// Skema validasi Zod yang sudah disesuaikan
const addressSchema = z.object({
  address: z.string().min(5, "Alamat wajib diisi (minimal 5 karakter)"),
  phone: z.string().min(8, "Nomor telepon wajib diisi (minimal 8 karakter)"),
  city: z.string().min(3, "Kota wajib diisi (minimal 3 karakter)"),
  zip: z.string().min(5, "Kode pos wajib diisi (minimal 5 karakter)"),
  // country, firstName, dan lastName dihilangkan
});

type AddressFormData = z.infer<typeof addressSchema>;

const EditAddressUserForm: React.FC = () => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  // 1. Fungsi untuk mengambil data alamat awal pengguna
  const fetchInitialProfileData = useCallback(
    async (userId: string) => {
      setIsFetchingInitialData(true);
      setFormMessage(null);
      console.log(
        "EDIT_ADDRESS: Fetching initial address for user ID:",
        userId
      );
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("address, phone, city, zip_code") // Hanya pilih field alamat yang relevan
          .eq("id", userId)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            console.warn(
              "EDIT_ADDRESS: No existing profile address data found, form will be blank or with defaults."
            );
            reset({
              // Reset ke default atau kosong jika tidak ada data
              address: "",
              phone: "",
              city: "",
              zip: "",
            });
          } else {
            throw error;
          }
        }

        if (profileData) {
          console.log(
            "EDIT_ADDRESS: Profile address data received:",
            profileData
          );
          reset({
            address: profileData.address || "",
            phone: profileData.phone || "",
            city: profileData.city || "",
            zip: profileData.zip_code || "", // Dari DB zip_code ke form zip
          });
        }
      } catch (err: any) {
        console.error("EDIT_ADDRESS: Error fetching initial address:", err);
        setFormMessage({
          type: "error",
          text: `Gagal memuat data alamat: ${err.message}`,
        });
      } finally {
        setIsFetchingInitialData(false);
      }
    },
    [supabase, reset]
  );

  // 2. Ambil data pengguna saat komponen dimuat
  useEffect(() => {
    const getUserAndFetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error(
          "EDIT_ADDRESS: User not logged in or error getting user.",
          userError
        );
        setFormMessage({
          type: "error",
          text: "Anda harus login untuk mengubah alamat.",
        });
        setIsFetchingInitialData(false);
        // Pertimbangkan redirect: import { useRouter } from "next/navigation"; const router = useRouter(); router.push('/sign-in');
        return;
      }
      setCurrentUserId(user.id);
      fetchInitialProfileData(user.id);
    };
    getUserAndFetchProfile();
  }, [supabase, fetchInitialProfileData]);

  // 3. Fungsi onSubmit untuk update ke Supabase
  const onSubmit: SubmitHandler<AddressFormData> = async (formData) => {
    if (!currentUserId) {
      setFormMessage({
        type: "error",
        text: "ID Pengguna tidak valid. Tidak bisa menyimpan.",
      });
      return;
    }

    setIsLoading(true);
    setFormMessage(null);

    try {
      // Siapkan data untuk update dengan nama kolom DB (snake_case)
      const updatePayload = {
        address: formData.address === "" ? null : formData.address,
        phone: formData.phone === "" ? null : formData.phone,
        city: formData.city === "" ? null : formData.city,
        zip_code: formData.zip === "" ? null : formData.zip, // Dari form 'zip' ke DB 'zip_code'
        // country, first_name, last_name dihilangkan
        updated_at: new Date().toISOString(),
      };

      console.log(
        "EDIT_ADDRESS: Attempting to update address for userId:",
        currentUserId
      );
      console.log("EDIT_ADDRESS: Data being sent for update:", updatePayload);

      const {
        data: updatedData,
        error,
        count,
      } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", currentUserId)
        .select();

      console.log(
        "EDIT_ADDRESS: Supabase update response - Data:",
        updatedData
      );
      console.log("EDIT_ADDRESS: Supabase update response - Error:", error);
      console.log(
        "EDIT_ADDRESS: Supabase update response - Count (matched rows for select after update):",
        count
      );

      if (error) {
        throw error;
      }

      if (updatedData && updatedData.length > 0) {
        setFormMessage({
          type: "success",
          text: "Alamat berhasil diperbarui!",
        });
        reset(formData); // Reset form dengan data yang baru disubmit
      } else if (!error) {
        console.warn(
          "EDIT_ADDRESS: Update call returned no error, but no data was returned by .select() or no rows changed."
        );
        setFormMessage({
          type: "success",
          text: "Perubahan alamat berhasil diproses (atau tidak ada perubahan terdeteksi).",
        });
        reset(formData);
      } else {
        setFormMessage({
          type: "error",
          text: "Terjadi kesalahan yang tidak diketahui saat menyimpan.",
        });
      }
    } catch (error: any) {
      console.error(
        "EDIT_ADDRESS: Catch block - Error updating address:",
        error
      );
      setFormMessage({
        type: "error",
        text: `Gagal memperbarui alamat: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingInitialData) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-400">
          Memuat data alamat...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Ubah Alamat Pengiriman
      </h2>
      {formMessage && (
        <div
          className={`p-3 rounded-md text-sm mb-4 ${
            formMessage.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {formMessage.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Alamat Lengkap
          </Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="Contoh: Jl. Merdeka No. 10, RT 01 RW 02..."
            className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          {errors.address && (
            <span className="text-red-500 text-xs mt-1">
              {errors.address.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nomor Telepon
            </Label>
            <Input
              type="tel"
              id="phone"
              {...register("phone")}
              placeholder="Contoh: 081234567890"
              className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div>
            <Label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kota/Kabupaten
            </Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="Contoh: Jakarta Pusat"
              className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            {errors.city && (
              <span className="text-red-500 text-xs mt-1">
                {errors.city.message}
              </span>
            )}
          </div>
        </div>

        <div>
          {" "}
          {/* Kode Pos sekarang tidak lagi di grid 2 kolom */}
          <Label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Kode Pos
          </Label>
          <Input
            id="zip"
            {...register("zip")}
            placeholder="Contoh: 10110"
            className="mt-1 w-full md:w-1/2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" // Lebar disesuaikan
            disabled={isLoading}
          />
          {errors.zip && (
            <span className="text-red-500 text-xs mt-1">
              {errors.zip.message}
            </span>
          )}
        </div>
        {/* Field Negara, Nama Depan, Nama Belakang sudah dihilangkan dari JSX */}

        <div className="flex items-center justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading || isFetchingInitialData}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan Alamat"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAddressUserForm;
