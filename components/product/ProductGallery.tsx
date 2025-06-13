"use client";

import Image from "next/image";
import React, { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isInModal?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  isInModal = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const isValidIndex = activeIndex >= 0 && activeIndex < images.length;
  const mainImage = isValidIndex ? images[activeIndex] : images[0];

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Tidak ada gambar</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <Image
          key={mainImage} // mencegah render konflik saat gambar berubah
          src={mainImage}
          alt={`${productName} image ${activeIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (index !== activeIndex) setActiveIndex(index);
              }}
              className={`w-20 h-20 relative rounded-md border-2 ${
                index === activeIndex ? "border-blue-600" : "border-transparent"
              } focus:outline-none`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
