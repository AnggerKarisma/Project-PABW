"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Komponen lain yang mungkin Anda gunakan
import RatingReview from "../others/RatingReview"; // Pastikan path ini benar
import ProductOptions from "./ProductOptions";   // Pastikan path ini benar

// Fungsi utilitas
import { calculateDiscount } from "@/lib/calculateDiscount"; // Pastikan path ini benar
import { formatRupiah } from "@/lib/formatRupiah";     // Pastikan path ini benar

// Impor tipe dari file types.ts terpusat Anda
import type { Product } from "@/types"; // Sesuaikan path jika perlu

interface SingleProductCartViewProps {
  product: Product | null; // Izinkan product bisa null untuk penanganan yang lebih aman
}

const SingleProductCartView = ({ product }: SingleProductCartViewProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Jika produk tidak ada atau belum dimuat, jangan render apa-apa atau tampilkan skeleton/placeholder
  if (!product) {
    // Jika !isMounted juga, akan direturn null oleh kondisi di bawah,
    // tapi ini untuk kasus jika product prop memang null.
    return null; 
  }
  
  // Trik isMounted untuk menghindari hydration mismatch, tapi pastikan product juga ada.
  if (!isMounted) {
    return null; // Atau tampilkan komponen skeleton kartu produk
  }

  // Destructuring dengan aman, memberikan nilai default jika perlu
  const {
    id,
    name = "Nama Produk Tidak Tersedia", // Default jika nama bisa null/undefined
    category = "Uncategorized",       // Default jika kategori bisa null/undefined
    images,                           // Asumsi images selalu array (minimal kosong) dari tipe Product
    stockItems = 0,                   // Default jika stockItems bisa null/undefined
    rating = 0,                       // Default untuk rating
    reviews,                          // reviews bisa null/undefined atau array
    price = 0,                        // Default untuk price
    discount = 0,                     // Default untuk discount
  } = product;

  // Pastikan images adalah array dan memiliki setidaknya satu gambar
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : "/placeholder/default-product.png"; // Sediakan placeholder default

  // Pastikan reviews adalah array sebelum mengakses length
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  // Pastikan price dan discount adalah angka sebelum kalkulasi
  const productPrice = typeof price === 'number' ? price : 0;
  const productDiscount = typeof discount === 'number' ? discount : 0;
  const discountedPrice = calculateDiscount(productPrice, productDiscount);

  const handleCategoryClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault(); // Mencegah navigasi Link default
    e.stopPropagation(); // Mencegah event klik pada Link terpicu lagi
    router.push(`/shop?category=${category}`);
  };

  return (
    <Link
      href={`/shop/product/${id}`} // Pastikan URL detail produk Anda benar
      className="relative group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div className="relative w-full h-[16rem] sm:h-[18rem] group-hover:scale-105 transition-transform duration-300">
          <Image
            className="object-contain" // object-cover mungkin lebih baik jika aspek rasio beragam
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Contoh 'sizes' untuk optimasi
            priority={false} // Set true hanya untuk gambar LCP di atas lipatan
          />
          {/* Badge Stok dan Diskon */}
          <div className="absolute top-2 right-2 space-y-1">
            {stockItems <= 0 ? (
              <p className="py-1 px-3 text-xs font-bold rounded-md bg-red-600 text-white">
                Stok Habis
              </p>
            ) : (
              productDiscount > 0 && ( // Hanya tampilkan jika ada diskon
                <p className="py-1 px-3 text-xs font-bold rounded-md bg-rose-500 text-white">
                  {productDiscount}% off
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* ProductOptions yang muncul saat hover (pastikan ini diatur dengan benar) */}
      <div className="hidden group-hover:flex absolute top-4 left-2 md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-2 z-10 flex-col gap-2 slideCartOptions">
         {/* Pastikan ProductOptions bisa menerima product atau field yang dibutuhkan */}
        <ProductOptions product={product} />
      </div>

      <div className="p-4 flex flex-col flex-grow"> {/* flex-grow agar bagian teks mengisi sisa ruang */}
        {category && (
          <p
            onClick={handleCategoryClick}
            className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-1 hover:underline cursor-pointer w-fit"
          >
            {category}
          </p>
        )}
        <h3 className="text-md sm:text-lg font-semibold capitalize text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 mb-1 leading-tight flex-grow">
          {name.length > 50 ? `${name.slice(0, 50)}...` : name}
        </h3>
        
        <RatingReview rating={rating} review={reviewCount} />

        <div className="mt-2 mb-3">
          {productDiscount > 0 && productPrice > 0 && (
            <span className="line-through text-gray-500 dark:text-gray-400 text-sm mr-2">
              {formatRupiah(productPrice, true)}
            </span>
          )}
          <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
            {formatRupiah(discountedPrice, true)}
          </span>
        </div>
        
        {/* ProductOptions di bawah (mungkin untuk tampilan mobile atau default) */}
        {/* Jika ProductOptions di sini berbeda dengan yang di hover, pastikan logikanya sesuai */}
        {/* Untuk konsistensi, mungkin cukup satu set ProductOptions yang visibility-nya diatur CSS */}
        {/* <div className="mt-auto pt-2 sm:hidden"> 
            <ProductOptions product={product} />
        </div> */}
      </div>
    </Link>
  );
};

export default SingleProductCartView;