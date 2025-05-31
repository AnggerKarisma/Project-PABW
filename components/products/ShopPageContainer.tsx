"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductViewChange from "../product/ProductViewChange";
// import { productsData } from "@/data/products/productsData";
import { createClient } from "@/utils/supabase/client";
import Pagination from "../others/Pagination";
import SingleProductListView from "@/components/product/SingleProductListView";
import { SearchParams } from "@/types";
import SingleProductCartView from "../product/SingleProductCartView";
import { Loader2 } from "lucide-react";
import Loader from "../others/Loader";
import { Tables } from "@/database.types";

type Product = Tables<"products"> & {
  reviews: Tables<"reviews">[];
};

interface ShopPageContainerProps {
  searchParams: SearchParams;
  gridColumn?: number;
}

const supabase = createClient();

const ShopPageContainer = ({
  searchParams,
  gridColumn,
}: ShopPageContainerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listView, setListView] = useState(false);
  const [productsData, setProductData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [paginatedData, setPaginatedData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.page) || 1
  );

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select(`*,reviews (*)`)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProductData(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch banners"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const itemsPerPage = 6;

  // Function to filter data based on search params
  const filterData = () => {
    let filteredProducts = productsData;

    // Filter by category
    if (searchParams.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === searchParams.category
      );
    }

    // Filter by brand
    if (searchParams.brand) {
      filteredProducts = filteredProducts.filter(
        (product) => product?.brand === searchParams.brand
      );
    }

    // Filter by color
    if (searchParams.color) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product != null && product!.color.includes(searchParams.color)
      );
    }

    // Filter by min and max price
    if (searchParams.min && searchParams.max) {
      const minPrice = parseFloat(searchParams.min);
      const maxPrice = parseFloat(searchParams.max);
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    // Apply other filters...

    return filteredProducts;
  };

  // Update filtered data whenever search params change
  useEffect(() => {
    setLoading(true);
    const filteredProducts = filterData();
    setFilteredData(filteredProducts!);
    setCurrentPage(1); // Reset pagination to first page when filters change
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // change currentPage when searchparams page change
  useEffect(() => {
    setCurrentPage(Number(searchParams.page) || 1);
  }, [searchParams.page]);

  // Update paginated data whenever filtered data or pagination settings change
  useEffect(() => {
    setLoading(true);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredData.slice(startIndex, endIndex);
    setPaginatedData(paginatedProducts);
    setLoading(false);
  }, [filteredData, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
        <Loader2 className="animate-spin text-xl" size={50} />
        <p>Loading products..</p>
      </div>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4 text-xl mx-auto font-semibold space-y-4">
        <ProductViewChange
          listView={listView}
          setListView={setListView}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          itemPerPage={itemsPerPage}
          currentPage={currentPage}
        />
        <p>Sorry no result found with your filter selection</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="md:ml-4 p-2 md:p-0">
      {/* product status and filter options */}
      <ProductViewChange
        listView={listView}
        setListView={setListView}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        itemPerPage={itemsPerPage}
        currentPage={currentPage}
      />

      {/* showing product list or cart view based on state */}
      {listView === true && (
        <div className="max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 gap-4 lg:gap-6">
          {paginatedData.map((product) => (
            <SingleProductListView key={product.id} product={product} />
          ))}
        </div>
      )}

      {listView === false && (
        <div
          className={`max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${
            gridColumn || 3
          } overflow-hidden  gap-4 lg:gap-6`}
        >
          {paginatedData.map((product) => (
            <SingleProductCartView key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* product pagination here */}
      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          currentPage={currentPage}
          pageName="page"
        />
      </Suspense>
    </div>
  );
};

export default ShopPageContainer;
