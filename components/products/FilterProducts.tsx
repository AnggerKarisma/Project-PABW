"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator"; // Sesuaikan path
import { Input } from "@/components/ui/input"; // Sesuaikan path
import { Label } from "@/components/ui/label"; // Sesuaikan path
import { Button } from "@/components/ui/button"; // Sesuaikan path
import { cn } from "@/lib/utils"; // Sesuaikan path
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Sesuaikan path
import { Tables } from "@/types"; // Pastikan path ini benar dan Tables sudah ada
import { formatRupiah } from "@/lib/formatRupiah"; // Sesuaikan path

// Definisikan tipe untuk data filter jika diperlukan
type Category = Tables<"categories">; // Asumsi Anda punya tipe Tables<'categories'>
type Brand = Tables<"brands">;
type Color = Tables<"colors">; // Asumsi Anda punya tipe Tables<'colors'>

const FilterProducts = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State untuk data filter dinamis
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]); // Data warna dari DB

  // State untuk nilai filter yang dipilih
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [minValue, setMinValue] = useState<number>(10); // Default min value
  const [maxValue, setMaxValue] = useState<number>(5000); // Default max value

  // State untuk loading data filter
  const [loadingFilters, setLoadingFilters] = useState(true);

  // --- 1. Fungsi untuk Mengupdate URL Search Params ---
  const updateSearchParams = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      // Selalu reset ke halaman 1 ketika filter berubah
      newSearchParams.set("page", "1");
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  // --- 2. Inisialisasi State Filter dari URL Search Params Saat Awal ---
  useEffect(() => {
    setSelectedCategory(searchParams.get("category"));
    setSelectedBrand(searchParams.get("brand"));
    setSelectedColor(searchParams.get("color"));
    setMinValue(Number(searchParams.get("min")) || 10);
    setMaxValue(Number(searchParams.get("max")) || 5000);
  }, [searchParams]); // Jalankan hanya saat searchParams berubah

  // --- 3. Fetch Data untuk Filter (Categories, Brands, Colors) ---
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoadingFilters(true);
      try {
        const [categoriesRes, brandsRes, colorsRes] = await Promise.all([
          supabase
            .from("categories")
            .select("id, name")
            .order("name", { ascending: true }),
          supabase
            .from("brands")
            .select("id, name")
            .order("name", { ascending: true }),
          supabase
            .from("colors")
            .select("id, name, hex_code")
            .order("name", { ascending: true }), // Asumsi tabel colors punya hex_code
        ]);

        // Di dalam fetchFilterData
        if (categoriesRes.error) throw categoriesRes.error;
        setCategories((categoriesRes.data as Category[]) || []); // Casting ke Category[]

        if (brandsRes.error) throw brandsRes.error;
        setBrands((brandsRes.data as Brand[]) || []); // Casting ke Brand[]

        if (colorsRes.error) throw colorsRes.error;
        setColors((colorsRes.data as Color[]) || []); // Casting ke Color[]
      } catch (error) {
        console.error("Error fetching filter data:", error);
        // Anda bisa menambahkan state error di sini jika perlu
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilterData();
  }, [supabase]);

  // --- 4. Handler untuk Perubahan Filter ---
  const handleCategorySelection = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    updateSearchParams({ category: newCategory });
  };

  const handleBrandSelection = (brandName: string) => {
    const newBrand = selectedBrand === brandName ? null : brandName;
    updateSearchParams({ brand: newBrand });
  };

  const handleColorSelection = (colorName: string) => {
    const newColor = selectedColor === colorName ? null : colorName;
    // Jika warna Anda memiliki format "nama-hex" dan Anda hanya ingin namanya:
    // updateSearchParams({ color: newColor ? newColor.split('-')[0] : null });
    updateSearchParams({ color: newColor });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(event.target.value);
    setMinValue(newMin);
    // Update URL saat input dilepas (onBlur) atau dengan tombol "Apply" untuk range
    // atau gunakan debounce jika ingin update saat mengetik
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value);
    setMaxValue(newMax);
  };

  const handlePriceRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMax = Number(event.target.value);
    setMaxValue(newMax);
    // Untuk range slider, update URL bisa langsung atau dengan debounce
    // updateSearchParams({ min: minValue.toString(), max: newMax.toString() });
  };

  // Fungsi untuk menerapkan filter harga (dipanggil oleh tombol atau onBlur)
  const applyPriceFilter = () => {
    // Pastikan min tidak lebih besar dari max
    const actualMin = Math.min(minValue, maxValue);
    const actualMax = Math.max(minValue, maxValue);
    updateSearchParams({
      min: actualMin.toString(),
      max: actualMax.toString(),
    });
  };

  const clearAllFilters = () => {
    // Mengosongkan semua searchParams kecuali 'page' yang di-set ke 1
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "1");
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    // State lokal juga perlu direset jika tidak sepenuhnya dikontrol oleh useEffect [searchParams]
    // setSelectedCategory(null);
    // setSelectedBrand(null);
    // setSelectedColor(null);
    // setMinValue(10);
    // setMaxValue(5000);
    // Efek dari perubahan searchParams akan mengupdate state ini.
  };

  if (loadingFilters) {
    return (
      <aside className="w-full md:w-72 p-4 space-y-4 ">
        <p>Loading filters...</p>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-72 p-4 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-white">
          Filter Produk
        </h2>
        <Button
          onClick={clearAllFilters}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          Reset Filter
        </Button>
      </div>
      <Separator />

      {/* Filter Harga */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Harga
        </h3>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <Label
              htmlFor="min"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Min:
            </Label>
            <Input
              id="min"
              type="number"
              value={minValue}
              onChange={handleMinPriceChange}
              onBlur={applyPriceFilter} // Terapkan saat fokus hilang
              className="w-full p-2 border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
              min={0}
            />
          </div>
          <div>
            <Label
              htmlFor="max"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Max:
            </Label>
            <Input
              id="max"
              type="number"
              value={maxValue}
              onChange={handleMaxPriceChange}
              onBlur={applyPriceFilter} // Terapkan saat fokus hilang
              className="w-full p-2 border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white"
              min={minValue} // Max tidak boleh kurang dari min
            />
          </div>
        </div>
        {/* Range Slider (opsional, stylingnya perlu disesuaikan) */}
        <Input
          type="range"
          min={10} // Sesuaikan dengan min produk Anda
          max={10000} // Sesuaikan dengan max produk Anda
          value={maxValue}
          onChange={handlePriceRangeChange}
          onMouseUp={applyPriceFilter} // Terapkan saat mouse dilepas dari slider
          onTouchEnd={applyPriceFilter} // Untuk mobile
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:bg-blue-500 [&::-moz-range-thumb]:bg-blue-500"
        />
        <p className="text-center text-green-600 dark:text-green-400 text-lg font-medium mt-1">
          {formatRupiah(maxValue)}
        </p>
        {/* Tombol Terapkan Harga bisa ditambahkan jika tidak mau onBlur/onMouseUp */}
        {/* <Button onClick={applyPriceFilter} size="sm" className="w-full mt-2">Terapkan Harga</Button> */}
      </div>
      <Separator />

      {/* Filter Kategori */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Kategori
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleCategorySelection(category.name!)} // Asumsi category.name tidak null
                className={cn(
                  "text-xs",
                  selectedCategory === category.name &&
                    "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Separator />

      {/* Filter Warna */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Warna
          </h3>
          <div className="flex flex-wrap gap-3 items-center">
            {colors.map((color) => (
              <button
                key={color.id}
                title={color.name!} // Asumsi color.name tidak null
                onClick={() => handleColorSelection(color.name!)}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                  selectedColor === color.name
                    ? "ring-blue-500 border-blue-600 dark:ring-blue-400 dark:border-blue-500"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                )}
                style={{
                  backgroundColor: color.hex_code ?? color.name ?? undefined,
                }} // Gunakan hex_code jika ada, fallback ke nama warna (misal "red", "blue")
              />
            ))}
          </div>
        </div>
      )}
      <Separator />

      {/* Filter Merek */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Merek
          </h3>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleBrandSelection(brand.name!)} // Asumsi brand.name tidak null
                className={cn(
                  "text-xs",
                  selectedBrand === brand.name &&
                    "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                )}
              >
                {brand.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default FilterProducts;
