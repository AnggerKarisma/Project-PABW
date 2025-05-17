"use client";
import React, { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define types for the form
interface ProductFormData {
  name: string;
  price: string;
  category: string;
  brand: string;
  type: "featured" | "top-rated" | "most-popular" | "new-arrivals";
  description: string;
  aboutItem?: string;
  color?: string;
  discount?: string;
}

// Define the schema for form validation
const productSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  price: z.string().min(1, "Harga wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  brand: z.string().min(1, "Merek wajib diisi"),
  type: z.enum(["featured", "top-rated", "most-popular", "new-arrivals"]),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  aboutItem: z.string().optional(),
  color: z.string().optional(),
  discount: z.string().optional(),
});

const ProductForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      brand: "",
      type: "featured",
      description: "",
      aboutItem: "",
      color: "",
      discount: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const processedData = {
      ...data,
      color: data.color ? data.color.split(",").map((c) => c.trim()) : [],
      discount: data.discount ? Number(data.discount) : undefined,
      images: selectedFiles,
    };

    console.log("Data formulir terkirim:", processedData);
    console.log("File:", selectedFiles);

    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    reset();
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tambah Produk Baru
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <div>
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Nama Produk
          </Label>
          <Input
            id="name"
            type="text"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("name")}
            placeholder="Masukkan nama produk"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Harga
          </Label>
          <Input
            id="price"
            type="text"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("price")}
            placeholder="Masukkan harga produk"
          />
          {errors.price && (
            <span className="text-red-500">{errors.price.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Diskon (%)
          </Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("discount")}
            placeholder="Masukkan diskon (jika ada)"
          />
          {errors.discount && (
            <span className="text-red-500">{errors.discount.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Kategori
          </Label>
          <Input
            id="category"
            type="text"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("category")}
            placeholder="Masukkan kategori produk"
          />
          {errors.category && (
            <span className="text-red-500">{errors.category.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Merek
          </Label>
          <Input
            id="brand"
            type="text"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("brand")}
            placeholder="Masukkan merek produk"
          />
          {errors.brand && (
            <span className="text-red-500">{errors.brand.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Tipe Produk
          </Label>
          <select
            id="type"
            className="mt-1 p-2 block w-full dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("type")}
          >
            <option value="featured">Unggulan</option>
            <option value="top-rated">Paling Favorit</option>
            <option value="most-popular">Terpopuler</option>
            <option value="new-arrivals">Produk Baru</option>
          </select>
          {errors.type && (
            <span className="text-red-500">{errors.type.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Deskripsi
          </Label>
          <textarea
            id="description"
            className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("description")}
            placeholder="Masukkan deskripsi produk"
          />
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Warna Tersedia (pisahkan dengan koma)
          </Label>
          <Input
            id="color"
            type="text"
            placeholder="Merah, Biru, Hijau"
            className="mt-1 p-2 block border dark:bg-slate-950 w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("color")}
          />
          {errors.color && (
            <span className="text-red-500">{errors.color.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="aboutItem"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Tentang Produk
          </Label>
          <textarea
            id="aboutItem"
            className="mt-1 border p-2 block w-full rounded-md dark:bg-slate-950 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("aboutItem")}
            placeholder="Info tambahan tentang produk"
          />
          {errors.aboutItem && (
            <span className="text-red-500">{errors.aboutItem.message}</span>
          )}
        </div>

        <div className="lg:col-span-2">
          <Label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Gambar Produk
          </Label>
          <p className="text-gray-500 text-sm mb-2">
            Kamu bisa mengunggah beberapa gambar untuk produk ini.
          </p>
          <Input
            id="images"
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                File Terpilih ({selectedFiles.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2"
                  >
                    <span className="text-sm truncate max-w-xs">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length === 0 && (
            <span className="text-red-500">Minimal satu gambar wajib diunggah</span>
          )}
        </div>

        <div className="lg:col-span-2 mt-4">
          <Button
            type="submit"
            disabled={isSubmitting || selectedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Sedang mengirim..." : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
