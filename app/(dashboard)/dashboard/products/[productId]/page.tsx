"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import RelatedProducts from "@/components/products/RelatedProducts";

// PERBAIKAN KRITIS DI SINI: Ubah jalur impor tipe
import type { ProductDetailed, Tables, ReviewDisplay } from "@/types"; // <-- INI YANG HARUS DIGANTI

interface ProductIdPageProps {
  params: { productId: string };
}

const ProductIdPage = ({ params }: ProductIdPageProps) => {
  const { productId } = params;
  const supabase = createClient();

  const [product, setProduct] = useState<ProductDetailed | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Tables<"products">[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = useCallback(async () => {
    const productIdNum = parseInt(productId, 10);
    if (isNaN(productIdNum)) {
      setError("ID Produk tidak valid (harus angka).");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProduct(null);
    setRelatedProducts([]);

    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          `
          *,
          reviews(id, content, rating, image, created_at, user_id, profiles(full_name, avatar_url)),
          categories(id, name),
          brands(id, name)
          `
        )
        .eq("id", productIdNum)
        .single();

      if (productError) {
        if (productError.code === "PGRST116") {
          throw new Error("Produk tidak ditemukan.");
        }
        throw productError;
      }

      if (!productData) {
        throw new Error("Produk tidak ditemukan.");
      }

      const fetchedProduct: ProductDetailed = {
        // PERBAIKAN: Pastikan productData benar-benar bertipe objek
        // Ini akan teratasi otomatis setelah impor tipe benar
        ...productData,
        reviews:
          productData.reviews?.map(
            (
              review: Tables<"reviews"> & {
                profiles?: Tables<"profiles"> | null;
              }
            ) => ({
              ...review,
              profiles: review.profiles || null,
            })
          ) || [],
        // PERBAIKAN: productData.categories dan productData.brands seharusnya sudah menjadi objek yang benar jika tipe benar
        categories: productData.categories || null,
        brands: productData.brands || null,
        aboutItem: productData.aboutItem || [],
        product_colors: (productData as any).product_colors || [],
      };

      setProduct(fetchedProduct);

      if (fetchedProduct.categories?.id) {
        const { data: relatedData, error: relatedError } = await supabase
          .from("products")
          .select("id, name, images, price, rating, discount, category_id")
          .eq("category_id", fetchedProduct.categories.id)
          .neq("id", fetchedProduct.id)
          .limit(5);

        if (relatedError) {
          console.warn("Gagal memuat produk terkait:", relatedError.message);
        } else {
          setRelatedProducts((relatedData as Tables<"products">[]) || []);
        }
      }
    } catch (err: any) {
      console.error("Error fetching product data:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data produk.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId, supabase]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">
          Memuat produk...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Oops! Terjadi Kesalahan
        </h2>
        <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
        <button
          onClick={() => fetchProductData()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Maaf, kami tidak dapat menemukan produk yang Anda cari.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 flex flex-col items-start gap-4 md:gap-6 min-h-screen">
      <div className="my-2 w-full">
        <BreadcrumbComponent
          links={[{ label: "Shop", href: "/shop" }]}
          pageText={product.name || "Detail Produk"}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 w-full">
        <ProductGallery
          isInModal={false}
          images={product.images || []}
          productName={product.name || "Produk"}
        />
        <ProductDetails product={product} />
      </div>
      {relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          currentProductId={product.id}
        />
      )}
    </div>
  );
};

export default ProductIdPage;
