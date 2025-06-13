"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Asumsi Anda pakai shadcn/ui Select
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button"; // Sesuaikan path
import { createClient } from "@/utils/supabase/client"; // Sesuaikan path
import { useRouter } from "next/navigation";

// Definisikan tipe enum untuk role di Zod, harus cocok dengan enum di DB
const UserRoleEnum = z.enum(["Admin", "courier", "user"]);

const createUserSchema = z
  .object({
    name: z.string().min(2, "Nama harus terdiri dari minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(6, "Kata sandi harus terdiri dari minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi kata sandi harus terdiri dari minimal 6 karakter"),
    role: UserRoleEnum, // Tambahkan validasi untuk role
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type CreateUserFormData = z.infer<typeof createUserSchema>;

const AdminCreateUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    control, // Diperlukan untuk komponen Select dari react-hook-form
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "user", // Set role default
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    setFormMessage(null);

    try {
      // Admin membuat user baru.
      // Kita akan menggunakan supabase.auth.signUp() dan melewatkan role di metadata
      // agar bisa diambil oleh trigger handle_new_user.
      // Jika Anda ingin bypass konfirmasi email untuk user yang dibuat admin,
      // Anda perlu menggunakan Edge Function dengan supabase.auth.admin.createUser().

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            user_role_to_set: data.role, // Kirim role yang dipilih ke metadata
            // Anda bisa menambahkan metadata lain jika perlu
          },
          // Jika Anda ingin user yang dibuat admin langsung aktif (tidak perlu konfirmasi email),
          // dan Anda TIDAK menggunakan Edge Function, Anda mungkin perlu mengatur
          // "Confirm email" menjadi false di Supabase Dashboard > Authentication > Providers > Email.
          // NAMUN, ini akan berlaku untuk semua pendaftaran.
          // Cara yang lebih baik adalah admin mengkonfirmasi manual atau pakai Edge Function.
        },
      });

      if (error) {
        throw error;
      }

      setFormMessage({
        type: "success",
        text:
          `Pengguna ${data.email} dengan role ${data.role} berhasil dibuat. ` +
          (authData.user?.identities && authData.user.identities.length > 0
            ? ""
            : "Membutuhkan konfirmasi email."),
      });
      // Reset form atau redirect jika perlu
      // router.push("/admin/users");
    } catch (error: any) {
      setFormMessage({
        type: "error",
        text: error.message || "Gagal membuat pengguna. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-2">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Buat Pengguna Baru (Admin)
        </h2>

        {formMessage && (
          <div
            className={`p-3 rounded-md text-sm mb-4 ${
              formMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {formMessage.text}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Input Name */}
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Lengkap
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Nama Pengguna"
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Input Email */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Alamat Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="email@example.com"
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kata Sandi
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="************"
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Input Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Konfirmasi Kata Sandi
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="************"
              className={`w-full border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Input Role (Select/Dropdown) */}
          <div>
            <Label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role Pengguna
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={`w-full border ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
                  >
                    <SelectValue placeholder="Pilih role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {UserRoleEnum.options.map((roleValue) => (
                      <SelectItem key={roleValue} value={roleValue}>
                        {roleValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Buat Akun"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUserForm;
