// src/components/products/RelatedProducts.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/formatRupiah";

// Asumsi tipe RelatedProduct sudah benar didefinisikan di sini atau di types/database.ts
// Jika Anda ingin menggunakannya secara global, pindahkan ini ke types/database.ts
type RelatedProduct = {
  id: number;
  name: string | null;
  images: string[] | null;
  price: number;
  rating: number | null;
  discount: number | null;
};

interface RelatedProductsProps {
  products: RelatedProduct[]; // Menggunakan tipe yang sesuai
  currentProductId: number; // Tipe ID produk adalah number (int8)
}

// INI BAGIAN UTAMA YANG PERLU DIPERBAIKI
const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  currentProductId,
}) => {
  // Filter produk terkait agar tidak menampilkan produk yang sedang dilihat
  const filteredProducts = products.filter((p) => p.id !== currentProductId);

  if (filteredProducts.length === 0) {
    return null; // Tidak menampilkan bagian ini jika tidak ada produk terkait
  }

  return (
    <section className="w-full mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
        Produk Terkait
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="block group bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative w-full h-40">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "/placeholder/default-product.png"
                }
                alt={product.name || "Product Image"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center mt-2">
                {product.discount && product.discount > 0 ? (
                  <>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mr-2">
                      {formatRupiah(
                        product.price * (1 - product.discount / 100)
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {formatRupiah(product.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatRupiah(product.price)}
                  </p>
                )}
              </div>
              {product.rating !== null && product.rating > 0 && (
                <div className="flex items-center text-yellow-500 text-sm mt-1">
                  <span>⭐ {product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
