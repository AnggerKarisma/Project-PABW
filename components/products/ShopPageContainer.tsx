"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import ProductViewChange from "../product/ProductViewChange"; // Pastikan path benar
import { createClient } from "@/utils/supabase/client"; // Pastikan path benar
import Pagination from "../others/Pagination"; // Pastikan path benar
import SingleProductListView from "@/components/product/SingleProductListView"; // Pastikan path benar
import { SearchParams, Tables } from "@/types"; // Pastikan path benar dan tipe didefinisikan
import SingleProductCartView from "../product/SingleProductCartView"; // Pastikan path benar
import { Loader2 } from "lucide-react";
import Loader from "../others/Loader"; // Pastikan path benar
import { useRouter, usePathname } from "next/navigation"; // usePathname ditambahkan

type Product = any; // GANTI DENGAN TIPE PRODUCT ANDA YANG BENAR DARI @/types

interface ShopPageContainerProps {
  searchParams: SearchParams;
  gridColumn?: number;
}

const ITEMS_PER_PAGE = 6;
const supabase = createClient();

const ShopPageContainer = ({
  searchParams,
  gridColumn,
}: ShopPageContainerProps) => {
  const router = useRouter();
  const pathname = usePathname(); // Untuk membuat URL baru dengan searchParams
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listView, setListView] = useState(false);
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const currentPage = Math.max(Number(searchParams.page) || 1, 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Bangun query dasar dengan select yang menyertakan relasi
      // untuk filtering berdasarkan nama di tabel relasi.
      let query = supabase.from("products").select(
        `
          *, 
          reviews(*), 
          categories!inner(id, name),  // INNER JOIN untuk filter by category name
          brands!inner(id, name),        // INNER JOIN untuk filter by brand name
          product_colors!inner(colors!inner(id, name, hex_code)) // INNER JOIN untuk filter by color name
        `,
        { count: "exact" }
      );
      // Catatan: Penggunaan !inner akan MENGECUALIKAN produk jika tidak memiliki kategori/brand/warna yang cocok.
      // Jika Anda ingin tetap menampilkan produk meskipun kategori/brand/warna tidak ada (dan hanya filter jika parameter ada),
      // maka jangan gunakan !inner di select awal, tapi filter dengan .or atau subquery yang lebih kompleks.
      // Untuk filter .eq pada relasi, biasanya !inner tidak selalu diperlukan di select awal,
      // Supabase akan mencoba mencocokkan. Mari kita coba tanpa !inner dulu di select utama
      // dan terapkan !inner hanya jika benar-benar diperlukan untuk filtering.

      query = supabase.from("products").select(
        `
          *, 
          reviews(*), 
          categories(id, name), 
          brands(id, name),
          product_colors(colors(id, name, hex_code))
        `, // Select relasi untuk bisa filter by name & display
        { count: "exact" }
      );

      // Filter berdasarkan KATEGORI (nama)
      if (searchParams.category) {
        // query = query.eq("categories.name", searchParams.category); // Cara lama
        // Supabase mungkin memerlukan Anda untuk menggunakan filter pada foreign key atau RPC untuk ini.
        // Cara yang lebih aman adalah mendapatkan category_id dulu.
        // Untuk filter langsung pada nama kategori melalui relasi:
        const { data: categoryData } = await supabase
          .from("categories")
          .select("id")
          .eq("name", searchParams.category)
          .single();
        if (categoryData) {
          query = query.eq("category_id", categoryData.id);
        } else {
          // Jika kategori tidak ditemukan, mungkin tidak ada hasil atau tampilkan semua (tergantung logika bisnis)
          setProductsToDisplay([]);
          setTotalProducts(0);
          setLoading(false);
          return;
        }
      }

      // Filter berdasarkan BRAND (nama)
      if (searchParams.brand) {
        const { data: brandData } = await supabase
          .from("brands")
          .select("id")
          .eq("name", searchParams.brand)
          .single();
        if (brandData) {
          query = query.eq("brand_id", brandData.id);
        } else {
          setProductsToDisplay([]);
          setTotalProducts(0);
          setLoading(false);
          return;
        }
      }

      // Filter berdasarkan WARNA (nama) - Ini yang paling kompleks karena Many-to-Many
      if (searchParams.color) {
        // Kita perlu produk yang memiliki setidaknya satu warna yang cocok.
        // Ini biasanya memerlukan subquery atau join khusus.
        // Cara paling mudah dengan Supabase adalah dengan RPC atau memfilter setelah join,
        // tapi untuk filter di DB, kita bisa coba dengan join.
        // Modifikasi: Ambil ID warna dulu, lalu filter produk yang ada di product_colors dengan color_id tersebut
        const { data: colorData } = await supabase
          .from("colors")
          .select("id")
          .eq("name", searchParams.color)
          .single();

        if (colorData) {
          // Ambil product_id dari product_colors yang memiliki color_id tersebut
          const { data: productIdsWithColor, error: pcError } = await supabase
            .from("product_colors")
            .select("product_id")
            .eq("color_id", colorData.id);

          if (pcError) throw pcError;

          if (productIdsWithColor && productIdsWithColor.length > 0) {
            const ids = productIdsWithColor.map((pc) => pc.product_id);
            query = query.in("id", ids);
          } else {
            // Tidak ada produk dengan warna ini
            setProductsToDisplay([]);
            setTotalProducts(0);
            setLoading(false);
            return;
          }
        } else {
          // Warna tidak ditemukan
          setProductsToDisplay([]);
          setTotalProducts(0);
          setLoading(false);
          return;
        }
      }

      // Filter Harga (sudah baik dengan validasi NaN)
      if (searchParams.min) {
        const minPrice = parseFloat(searchParams.min);
        if (!isNaN(minPrice)) {
          query = query.gte("price", minPrice);
        }
      }
      if (searchParams.max) {
        const maxPrice = parseFloat(searchParams.max);
        if (!isNaN(maxPrice)) {
          query = query.lte("price", maxPrice);
        }
      }

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      // Paginasi range Supabase: from (inklusif), to (inklusif)
      const endIndex = startIndex + ITEMS_PER_PAGE - 1;

      query = query.range(startIndex, endIndex);
      query = query.order("created_at", { ascending: false });

      const { data, error: queryError, count } = await query;

      if (queryError) {
        console.error("Supabase query error:", queryError);
        throw queryError;
      }

      const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) {
        const newRedirectSearchParams = new URLSearchParams(
          searchParams.toString()
        ); // Konversi searchParams ke string dulu
        newRedirectSearchParams.set("page", totalPages.toString());
        router.replace(`${pathname}?${newRedirectSearchParams.toString()}`);
        return;
      }

      setProductsToDisplay((data as Product[]) || []); // Lakukan casting tipe yang aman
      setTotalProducts(count || 0);
    } catch (err) {
      console.error("Error fetching products:", err); // Ini log yang penting
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProductsToDisplay([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage, router, supabase, pathname]); // Tambahkan supabase & pathname jika digunakan di dalam

  // Lakukan hal serupa untuk brandData dan colorData
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ... (sisa JSX Anda untuk loading, error, tampilan produk, dan pagination tetap sama) ...
  // Pastikan di JSX, saat Anda menampilkan nama kategori, brand, atau warna, Anda mengambilnya dari data relasi
  // yang sudah di-fetch, misalnya: product.categories.name, product.brands.name, product.product_colors[...].colors.name

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
        <Loader2 className="animate-spin text-xl" size={50} />
        <p>Loading products..</p>
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-3 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Tampilkan state ketika tidak ada produk
  if (productsToDisplay.length === 0 && !loading) {
    return (
      <div className="md:ml-4 p-2 md:p-0">
        <ProductViewChange
          listView={listView}
          setListView={setListView}
          totalPages={Math.ceil(totalProducts / ITEMS_PER_PAGE)}
          itemPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
        />
        <div className="h-[calc(100vh-200px)] w-full flex items-center justify-center flex-col gap-4 text-xl mx-auto font-semibold space-y-4">
          <p>Sorry, no results found with your filter selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-4 p-2 md:p-0">
      <ProductViewChange
        listView={listView}
        setListView={setListView}
        totalPages={Math.ceil(totalProducts / ITEMS_PER_PAGE)}
        itemPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
      />

      {/* Tampilan produk berdasarkan view mode */}
      {listView ? (
        <div className="max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 gap-4 lg:gap-6">
          {productsToDisplay.map((product) => (
            // Pastikan SingleProductListView bisa handle struktur Product baru (dengan nested category/brand/colors)
            <SingleProductListView key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          className={`max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${
            gridColumn || 3
          } gap-4 lg:gap-6`}
        >
          {productsToDisplay.map((product) => (
            // Pastikan SingleProductCartView bisa handle struktur Product baru
            <SingleProductCartView key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Tampilkan pagination hanya jika diperlukan */}
      {totalProducts > ITEMS_PER_PAGE && (
        <Suspense fallback={<Loader />}>
          <Pagination
            totalPages={Math.ceil(totalProducts / ITEMS_PER_PAGE)}
            currentPage={currentPage}
            pageName="page"
          />
        </Suspense>
      )}
    </div>
  );
};

export default ShopPageContainer;
