"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  Suspense,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import ProductActions from "@/components/dashboard/product/ProductActions";
import ProductHeader from "@/components/dashboard/product/ProductHeader";
import Loader from "@/components/others/Loader";
import { Loader2 } from "lucide-react";
import Pagination from "@/components/others/Pagination";
import { formatRupiah } from "@/lib/formatRupiah";
import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/types"; // Pastikan path ini benar

// --- TIPE DATA ---
export type CategoryInfo = Pick<Tables<"categories">, "id" | "name"> | null;
export type BrandInfo = Pick<Tables<"brands">, "id" | "name"> | null;

export type ProductEntry = Tables<"products"> & {
  categories: CategoryInfo;
  brands: BrandInfo;
};

const ITEMS_PER_PAGE = 6;

const ProductsPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // State untuk menyimpan user ID

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageFromUrl = searchParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });
  const currentPageRef = useRef(currentPage);

  const [totalProducts, setTotalProducts] = useState(0);
  const [isUserChecked, setIsUserChecked] = useState(false); // Untuk menandai pengecekan user awal selesai

  // useEffect pertama: Memeriksa sesi pengguna dan mengatur currentUserId
  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        setIsUserChecked(true);
        return;
      }

      if (!session) {
        setError("Akses ditolak. Silakan login.");
        setLoading(false);
        router.push("/sign-in"); // Arahkan ke login jika tidak ada sesi
        setIsUserChecked(true);
        return;
      }

      setCurrentUserId(session.user.id); // Simpan ID pengguna
      setIsUserChecked(true); // Tandai pengecekan user selesai
    };
    checkUserSession();
  }, [supabase, router]);

  // Fungsi untuk mengambil produk berdasarkan ID pengguna yang "memproduksi"
  const fetchUserProducts = useCallback(
    async (page: number, userId: string | null) => {
      if (!userId) {
        // Jangan fetch jika userId belum tersedia (belum login atau masih loading)
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const selectString = `
          id, name, description, price, discount, rating, images, stockItems,
          aboutItem, created_at, diproduksi, brand_id, category_id,
          categories (id, name),
          brands (id, name)
        `;

        let query = supabase
          .from("products")
          .select(selectString, { count: "exact" })
          .eq("diproduksi", userId) // FILTER UTAMA: Hanya ambil produk yang diproduksi oleh userId ini
          .order("created_at", { ascending: false })
          .range(from, to);

        const { data, error: dbError, count } = await query;

        if (dbError) {
          throw dbError;
        }

        const processedData = (data || []).map((p) => {
          const categoryData =
            Array.isArray(p.categories) && p.categories.length > 0
              ? p.categories[0]
              : p.categories === null ||
                (typeof p.categories === "object" &&
                  !Array.isArray(p.categories))
              ? p.categories
              : null;

          const brandData =
            Array.isArray(p.brands) && p.brands.length > 0
              ? p.brands[0]
              : p.brands === null ||
                (typeof p.brands === "object" && !Array.isArray(p.brands))
              ? p.brands
              : null;

          return {
            ...p,
            categories: categoryData as CategoryInfo,
            brands: brandData as BrandInfo,
          };
        });

        setProducts(processedData as ProductEntry[]);
        setTotalProducts(count || 0);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Gagal memuat produk.");
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // useEffect kedua: Mengelola pagination dan memanggil fetchUserProducts
  useEffect(() => {
    const pageFromUrlString = searchParams.get("page");
    const pageFromUrl = pageFromUrlString ? parseInt(pageFromUrlString, 10) : 1;

    if (pageFromUrl !== currentPageRef.current) {
      setCurrentPage(pageFromUrl);
    }

    // Panggil fetchUserProducts hanya setelah user session dicek DAN currentUserId tersedia
    if (isUserChecked && currentUserId) {
      fetchUserProducts(currentPage, currentUserId);
    } else if (isUserChecked && !currentUserId) {
      // Jika user sudah dicek tapi tidak ada userId (berarti tidak login atau error sesi),
      // pastikan loading berhenti dan mungkin tampilkan pesan.
      setLoading(false);
      setError(
        "Tidak ada pengguna yang login atau sesi tidak valid. Produk tidak dapat dimuat."
      );
    }
  }, [
    isUserChecked,
    searchParams,
    fetchUserProducts,
    currentPage,
    currentUserId,
  ]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    const currentQueryParams = new URLSearchParams(searchParams.toString());
    currentQueryParams.set("page", newPage.toString());
    router.push(`${pathname}?${currentQueryParams.toString()}`, {
      scroll: false,
    });
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Tampilkan loader jika sedang memuat DAN belum selesai mengecek user
  if (!isUserChecked) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-3 text-gray-700 dark:text-gray-300">
          Memverifikasi sesi pengguna...
        </p>
      </div>
    );
  }

  // Tampilkan loader jika sudah cek user, ada userId, dan masih loading data produk
  if (loading && currentUserId && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-3 text-gray-700 dark:text-gray-300">
          Memuat produk Anda...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6 bg-red-50 dark:bg-red-900/30 rounded-md">
        Error: {error}
      </div>
    );
  }

  // Jika tidak ada user ID setelah pemeriksaan, dan tidak ada error, berarti belum login.
  if (!currentUserId && isUserChecked && !error) {
    return (
      <div className="text-center text-red-500 p-6 bg-red-50 dark:bg-red-900/30 rounded-md">
        Anda harus login untuk melihat produk Anda.
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 my-4">
      <ProductHeader />{" "}
      {/* Mungkin perlu prop title yang berbeda, misal "Produk Saya" */}
      <div className="overflow-x-auto mt-4">
        {loading && products.length > 0 && (
          <div className="text-sm text-center py-2 text-gray-500 dark:text-gray-400">
            Memperbarui daftar...
          </div>
        )}
        {!loading && products.length === 0 && !error && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            Tidak ada produk yang Anda miliki ditemukan.
            <Link
              href="/dashboard/products/add"
              className="text-blue-600 hover:underline ml-1"
            >
              Tambah Produk Baru?
            </Link>
          </p>
        )}
        {products.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "/placeholder/default-product.png"
                      }
                      alt={product.name || "Gambar Produk"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {product.name
                      ? product.name.length > 35
                        ? `${product.name.slice(0, 32)}...`
                        : product.name
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.price != null ? formatRupiah(product.price) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.categories?.name ||
                      (product.category_id
                        ? `ID: ${product.category_id}`
                        : "N/A")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductActions
                      productId={product.id}
                      onDeleteProduct={() => {
                        console.log("Hapus produk ID:", product.id);
                        // Implementasi fungsi hapus
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Suspense fallback={<Loader />}>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
