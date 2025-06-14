"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label"; // Sesuaikan path jika perlu
import { Input } from "@/components/ui/input"; // Sesuaikan path jika perlu
import { Button } from "@/components/ui/button"; // Sesuaikan path jika perlu
import { createClient } from "@/utils/supabase/client"; // Sesuaikan path

// Skema validasi Zod yang sudah disesuaikan
const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .optional()
    .or(z.literal("")), // Diganti menjadi fullName
  address: z.string().min(5, "Alamat wajib diisi (minimal 5 karakter)"),
  phone: z.string().min(8, "Nomor telepon wajib diisi (minimal 8 karakter)"),
  city: z.string().min(3, "Kota wajib diisi (minimal 3 karakter)"),
  zip: z.string().min(5, "Kode pos wajib diisi (minimal 5 karakter)"),
  // country dihilangkan sesuai permintaan sebelumnya
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutForm: React.FC = () => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // 1. Fungsi untuk mengambil data profil/alamat awal pengguna
  const fetchInitialData = useCallback(
    async (userId: string) => {
      setIsFetchingInitialData(true);
      setFormMessage(null);
      console.log("CHECKOUT_FORM: Fetching initial data for user ID:", userId);
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("full_name, address, phone, city, zip_code") // Ambil full_name
          .eq("id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (profileData) {
          console.log("CHECKOUT_FORM: Initial data received:", profileData);
          reset({
            fullName: profileData.full_name || "", // Dari DB full_name
            address: profileData.address || "",
            phone: profileData.phone || "",
            city: profileData.city || "",
            zip: profileData.zip_code || "",
          });
        } else {
          console.log(
            "CHECKOUT_FORM: No existing profile data found, form will be blank or with defaults."
          );
          reset({
            fullName: "",
            address: "",
            phone: "",
            city: "",
            zip: "",
          });
        }
      } catch (err: any) {
        console.error("CHECKOUT_FORM: Error fetching initial data:", err);
        setFormMessage({
          type: "error",
          text: `Gagal memuat data Anda: ${err.message}`,
        });
      } finally {
        setIsFetchingInitialData(false);
      }
    },
    [supabase, reset]
  );

  // 2. Ambil user ID dan data awal saat komponen dimuat
  useEffect(() => {
    const getUserAndFetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error(
          "CHECKOUT_FORM: User not logged in or error getting user.",
          userError
        );
        setFormMessage({
          type: "error",
          text: "Anda harus login untuk melanjutkan checkout.",
        });
        setIsFetchingInitialData(false);
        return;
      }
      setCurrentUserId(user.id);
      fetchInitialData(user.id);
    };
    getUserAndFetchData();
  }, [supabase, fetchInitialData]);

  // 3. Fungsi onSubmit untuk menyimpan data ke Supabase
  const onSubmit: SubmitHandler<CheckoutFormData> = async (formData) => {
    if (!currentUserId) {
      setFormMessage({
        type: "error",
        text: "Sesi pengguna tidak valid. Silakan login ulang.",
      });
      return;
    }

    if (!isDirty) {
      setFormMessage({
        type: "info",
        text: "Tidak ada perubahan data untuk disimpan.",
      });
      // Untuk checkout, Anda mungkin tetap ingin melanjutkan proses selanjutnya walau data alamat sama
      // proceedToNextCheckoutStep(formData); // Contoh
      return;
    }

    setIsLoading(true);
    setFormMessage(null);

    try {
      const profileUpdatePayload = {
        full_name: formData.fullName === "" ? null : formData.fullName, // Simpan fullName ke full_name
        address: formData.address === "" ? null : formData.address,
        phone: formData.phone === "" ? null : formData.phone,
        city: formData.city === "" ? null : formData.city,
        zip_code: formData.zip === "" ? null : formData.zip,
        updated_at: new Date().toISOString(),
      };

      console.log(
        "CHECKOUT_FORM: Attempting to update profile for userId:",
        currentUserId
      );
      console.log("CHECKOUT_FORM: Data being sent:", profileUpdatePayload);

      const {
        data: updatedData,
        error,
        count,
      } = await supabase
        .from("profiles")
        .update(profileUpdatePayload)
        .eq("id", currentUserId)
        .select();

      console.log(
        "CHECKOUT_FORM: Supabase update response - Data:",
        updatedData
      );
      console.log("CHECKOUT_FORM: Supabase update response - Error:", error);
      console.log("CHECKOUT_FORM: Supabase update response - Count:", count);

      if (error) {
        throw error;
      }

      if (updatedData && updatedData.length > 0) {
        setFormMessage({
          type: "success",
          text: "Informasi pengiriman berhasil disimpan!",
        });
        reset(formData);
      } else if (!error) {
        console.warn(
          "CHECKOUT_FORM: Update call returned no error, but no data was returned or no rows changed."
        );
        setFormMessage({
          type: "success",
          text: "Informasi pengiriman berhasil diproses.",
        });
        reset(formData);
      } else {
        setFormMessage({
          type: "error",
          text: "Terjadi kesalahan yang tidak diketahui.",
        });
      }
    } catch (error: any) {
      console.error("CHECKOUT_FORM: Catch block - Error saving data:", error);
      setFormMessage({
        type: "error",
        text: `Gagal menyimpan informasi: ${error.message}`,
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
          Memuat informasi Anda...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Informasi Pengiriman
      </h2>
      {formMessage && (
        <div
          className={`p-3 rounded-md text-sm mb-4 ${
            formMessage.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-200"
              : formMessage.type === "error"
              ? "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-200"
              : "bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-200"
          }`}
        >
          {formMessage.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nama Lengkap Penerima
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="Nama lengkap sesuai KTP/identitas"
            className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading || isFetchingInitialData}
          />
          {errors.fullName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.fullName.message}
            </span>
          )}
        </div>

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
            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
            className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading || isFetchingInitialData}
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
              placeholder="Untuk konfirmasi pengiriman"
              className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading || isFetchingInitialData}
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
              className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading || isFetchingInitialData}
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
          {/* Kode Pos sekarang tidak di grid 2 kolom, seperti sebelumnya */}
          <Label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Kode Pos
          </Label>
          <Input
            id="zip"
            {...register("zip")}
            className="mt-1 w-full md:w-1/2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading || isFetchingInitialData}
          />
          {errors.zip && (
            <span className="text-red-500 text-xs mt-1">
              {errors.zip.message}
            </span>
          )}
        </div>
        {/* Field Negara sudah dihilangkan */}

        <div className="flex items-center justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading || isFetchingInitialData}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 px-6 py-2.5 text-base"
          >
            {isLoading ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
