"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils"; // Asumsi Anda menggunakan cn untuk class names

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  /** Nama query parameter untuk halaman, contoh: "page" atau "halamanproduk" */
  pageQueryParamName?: string; // Dibuat opsional, default ke "page"
  /** Fungsi callback yang dipanggil ketika halaman berubah, mengirimkan nomor halaman baru.
   * Jika diberikan, komponen ini tidak akan melakukan navigasi router sendiri.
   */
  onPageChange?: (page: number) => void;
  /** Jumlah tombol halaman yang ditampilkan di sekitar halaman saat ini */
  siblingCount?: number;
  /** Kelas CSS tambahan untuk kontainer utama */
  className?: string;
}

const DOTS = "...";

const Pagination = ({
  totalPages,
  currentPage,
  pageQueryParamName = "page", // Default ke "page"
  onPageChange,
  siblingCount = 1, // Default menampilkan 1 halaman di kiri & kanan halaman aktif
  className,
}: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fungsi untuk menangani klik pada nomor halaman atau tombol Navigasi
  const handlePageChange = (pageNumber: number | string) => {
    const page = Number(pageNumber);
    if (page === currentPage || page < 1 || page > totalPages) {
      return; // Tidak melakukan apa-apa jika halaman sama, atau di luar batas
    }

    if (onPageChange) {
      // Jika ada callback onPageChange, panggil itu (komponen induk yang handle navigasi)
      onPageChange(page);
    } else {
      // Jika tidak ada callback, komponen ini handle navigasi sendiri via URL
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set(pageQueryParamName, page.toString());
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }
  };

  // Logika untuk membuat rentang nomor halaman dengan elipsis (...)
  // Diadaptasi dari berbagai implementasi paginasi yang umum
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*DOTS

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    // Seharusnya tidak pernah sampai sini jika logika di atas benar, tapi sebagai fallback
    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  if (totalPages <= 1) {
    return null; // Tidak perlu menampilkan paginasi jika hanya ada 1 halaman atau kurang
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex justify-center items-center my-8 space-x-1",
        className
      )}
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Halaman Sebelumnya"
      >
        Sebelumnya
      </button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span
              key={`${DOTS}-${index}`}
              className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500"
            >
              {DOTS}
            </span>
          );
        }

        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={currentPage === pageNumber}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              currentPage === pageNumber
                ? "bg-blue-600 text-white cursor-default dark:bg-blue-500"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            )}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Halaman Berikutnya"
      >
        Berikutnya
      </button>
    </nav>
  );
};

export default Pagination;
