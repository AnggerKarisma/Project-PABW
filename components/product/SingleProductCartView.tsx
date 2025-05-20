"use client";
import React, { useEffect, useState } from "react";
import RatingReview from "../others/RatingReview";
import Link from "next/link";
import { Product } from "@/types";
import { calculateDiscount } from "@/lib/calculateDiscount";
import { useRouter } from "next/navigation";
import ProductOptions from "./ProductOptions";
import { formatRupiah } from "@/lib/formatRupiah";

const SingleProductCartView = ({ product }: { product: Product }) => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const { category, discount, id, name, price, rating, reviews, stockItems } =
    product;

  const discountedPrice = calculateDiscount(price, discount);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Link
      href={`/shop/${id}`}
      className="relative border rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="my-2 space-y-1 p-4">
        <p
          onClick={(e) => {
            e.preventDefault();
            router.push(`shop?category=${category}`);
          }}
          className="text-sm text-sky-500 font-light -mb-1 hover:opacity-60"
        >
          {category}
        </p>
        <h3 className="text-xl font-bold capitalize hover:text-green-500">
          {name.slice(0, 45)}
          {name.length > 45 && "..."}
        </h3>
        <RatingReview rating={rating} review={reviews.length} />
        <div className="text-lg font-bold space-x-3">
          <span className="line-through text-muted-foreground">
            {formatRupiah(price, true)}
          </span>
          <span className="text-xl font-bold text-green-500">
            {formatRupiah(discountedPrice, true)}
          </span>
        </div>
        <div className="mt-2">
          <ProductOptions product={product} />
        </div>
      </div>
    </Link>
  );
};

export default SingleProductCartView;
