import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

const ProductHeader = () => {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Produk
      </h2>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Cari produk berdasarkan nama"
          className="p-5 rounded-md w-full lg:w-96"
        />
        <Link
          href="/dashboard/products/add-product"
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg whitespace-nowrap"
        >
          Tambah Produk
        </Link>
      </div>
    </div>
  );
};

export default ProductHeader;
