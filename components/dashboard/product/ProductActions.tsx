"use client"; // Jika ada interaktivitas atau hooks, "use client" diperlukan

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Asumsi path ini benar
import { MoreHorizontal, Eye, Edit3, Trash2 } from "lucide-react"; // Tambahkan ikon
import Link from "next/link";
// import type { Product } from "@/types"; // Impor jika Anda passing seluruh objek product

interface ProductActionsProps {
  productId: string | number; // ID produk untuk link dan aksi
  // Anda bisa menambahkan prop lain jika perlu, misalnya:
  // productName?: string;
  onDeleteProduct?: () => void; // Fungsi callback untuk menghapus produk
}

const ProductActions = ({
  productId,
  onDeleteProduct,
}: ProductActionsProps) => {
  // Handler untuk konfirmasi sebelum menghapus (opsional)
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Mencegah perilaku default jika di dalam Link atau form
    e.stopPropagation(); // Mencegah Popover langsung tertutup jika onDeleteProduct memicu re-render cepat

    // Anda bisa menambahkan konfirmasi di sini
    // const confirmed = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");
    // if (confirmed && onDeleteProduct) {
    //   onDeleteProduct();
    // }
    if (onDeleteProduct) {
      onDeleteProduct();
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          {/* Menggunakan button di dalam PopoverTrigger untuk aksesibilitas yang lebih baik */}
          <button
            aria-label="Opsi Produk"
            className="flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors duration-200"
          >
            <MoreHorizontal size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 space-y-1" align="end">
          {/* align="end" agar popover tidak keluar layar jika di ujung kanan tabel */}
          <Link
            href={`/shop/product/${productId}`} // Arahkan ke halaman publik produk
            target="_blank" // Buka di tab baru
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 px-3 rounded-md w-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye size={16} className="mr-1" />
            Lihat Produk
          </Link>
          <Link
            // Sesuaikan path ini dengan halaman edit produk di dashboard Anda
            href={`/dashboard/products/edit/${productId}`}
            className="flex items-center gap-2 py-2 px-3 rounded-md w-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit3 size={16} className="mr-1" />
            Perbarui Produk
          </Link>
          {onDeleteProduct && ( // Hanya tampilkan tombol hapus jika fungsi onDeleteProduct diberikan
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 w-full text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 py-2 px-3 rounded-md transition-colors"
            >
              <Trash2 size={16} className="mr-1" />
              Hapus Produk
            </button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProductActions;
