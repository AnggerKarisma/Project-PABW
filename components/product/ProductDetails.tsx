// src/components/product/ProductDetails.tsx
import React from "react";
import Image from "next/image"; // <-- TAMBAHKAN IMPORT INI
import { ProductDetailed, ReviewDisplay } from "@/types"; // Sesuaikan path

interface ProductDetailsProps {
  product: ProductDetailed;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Anda akan menampilkan detail produk di sini, termasuk:
  // product.name, product.price, product.description, product.stockItems, product.rating
  // product.categories?.name, product.brands?.name
  // Dan mungkin ProductTab yang menggunakan product.aboutItem dan product.reviews
  return (
    <div className="lg:col-span-1">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h1>
      {/* Tampilkan kategori dan merek jika ada */}
      {product.categories && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Kategori: {product.categories.name}
        </p>
      )}
      {product.brands && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Merek: {product.brands.name}
        </p>
      )}

      {/* Harga dan Diskon */}
      <div className="flex items-center mb-4">
        {product.discount && product.discount > 0 ? (
          <>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mr-3">
              {formatRupiah(product.price * (1 - product.discount / 100))}
            </p>
            <p className="text-xl text-gray-500 dark:text-gray-400 line-through">
              {formatRupiah(product.price)}
            </p>
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
              -{product.discount}%
            </span>
          </>
        ) : (
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {formatRupiah(product.price)}
          </p>
        )}
      </div>

      {/* Rating */}
      {product.rating !== null && product.rating > 0 && (
        <div className="flex items-center mb-4 text-yellow-500">
          {/* Render bintang sesuai rating */}
          <span>⭐ {product.rating.toFixed(1)}</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            ({product.reviews?.length || 0} Ulasan)
          </span>
        </div>
      )}

      {/* Stock */}
      <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
        Stok Tersedia:{" "}
        {product.stockItems !== null ? product.stockItems : "N/A"}
      </p>

      {/* Deskripsi Singkat */}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {product.description}
      </p>

      {/* Bagian untuk Menambah ke Keranjang/Wishlist (tidak termasuk dalam scope ini) */}
      {/* <div className="flex gap-4 mb-8">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Tambah ke Keranjang
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Tambah ke Wishlist
        </button>
      </div> */}

      {/* ProductTab (About Item, Reviews) */}
      <div className="mt-8">
        {/* Implementasikan ProductTab di sini, misalnya menggunakan komponen tab dari shadcn/ui */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Detail Produk
        </h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {product.aboutItem && product.aboutItem.length > 0 ? (
            product.aboutItem.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>Tidak ada detail tambahan.</li>
          )}
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          Ulasan Produk
        </h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {review.user_id}{" "}
                  {/* Anda bisa join dengan profiles untuk menampilkan nama penulis */}
                </p>
                <div className="flex items-center text-yellow-500 text-sm mt-1">
                  <span>Rating: {review.rating} ⭐</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {review.content}
                </p>
                {review.image && (
                  <Image
                    src={review.image}
                    alt="Review image"
                    width={80}
                    height={80}
                    className="mt-2 rounded"
                  />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada ulasan untuk produk ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

// Utility untuk format rupiah (jika belum ada)
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
