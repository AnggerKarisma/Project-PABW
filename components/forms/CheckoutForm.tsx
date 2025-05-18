'use client';
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Skema validasi Zod
const schema = z.object({
  firstName: z.string().min(3, "Nama depan wajib diisi (minimal 3 karakter)"),
  lastName: z.string().min(3, "Nama belakang wajib diisi (minimal 3 karakter)"),
  address: z.string().min(5, "Alamat wajib diisi (minimal 5 karakter)"),
  phone: z.string().min(8, "Nomor telepon wajib diisi (minimal 8 karakter)"),
  city: z.string().min(3, "Kota wajib diisi (minimal 3 karakter)"),
  zip: z.string().min(5, "Kode pos wajib diisi (minimal 5 karakter)"),
  country: z.string().min(2, "Negara wajib diisi (minimal 2 karakter)"),
});

type FormData = z.infer<typeof schema>;

const CheckoutForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Nama Depan</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Nama Belakang</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Input
            id="address"
            {...register("address")}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
          />
          {errors.address && (
            <span className="text-red-500">{errors.address.message}</span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="city">Kota</Label>
            <Input
              id="city"
              {...register("city")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.city && (
              <span className="text-red-500">{errors.city.message}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip">Kode Pos</Label>
            <Input
              id="zip"
              {...register("zip")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.zip && (
              <span className="text-red-500">{errors.zip.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="country">Negara</Label>
            <Input
              id="country"
              {...register("country")}
              className="w-full p-6 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none"
            />
            {errors.country && (
              <span className="text-red-500">{errors.country.message}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
