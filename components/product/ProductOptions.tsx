"use client";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { showToast } from "@/lib/showToast";
import { Product } from "@/types";
import { useProductQuickViewStore } from "@/store/productQuickViewStore";
import Loader from "../others/Loader";

const ProductOptions = ({ product }: { product: Product }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { openModal } = useProductQuickViewStore();
  const { images, name } = product;

  const { addToCart } = useCartStore();
  const { addToWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loader />;
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1, selectedColor: "" });
    showToast("Produk ditambahkan ke keranjang", images[0], name);
  };

  const handleAddToWishList = () => {
    if (isInWishlist(product.id)) {
      showToast("Produk sudah ada di daftar keinginan", images[0], name);
    } else {
      addToWishlist(product);
      showToast("Produk ditambahkan ke daftar keinginan", images[0], name);
    }
  };

  const handleProductQuickView = () => {
    openModal(product);
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.preventDefault()}
    >
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleAddToWishList}
              className="p-2 rounded-lg bg-slate-900 text-white cursor-pointer"
            >
              <Heart />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tambah ke Daftar Keinginan</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleProductQuickView}
              className="p-2 rounded-lg bg-slate-900 text-white cursor-pointer"
            >
              <Eye />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lihat Cepat</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleAddToCart}
              className="p-2 rounded-lg bg-slate-900 text-white cursor-pointer"
            >
              <ShoppingBag />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tambah ke Keranjang</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProductOptions;
