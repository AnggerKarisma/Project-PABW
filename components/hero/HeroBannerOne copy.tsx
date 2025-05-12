"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client"; // Your browser client

interface Banner {
  id: number;
  title: string;
  description: string;
  images: string[];
  button: string;
  discount_text: string;
  link: string;
  created_at: string;
}

const HeroBannerOne = () => {
  const [bannersData, setBannersData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBannersData(data || []);
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

  if (loading) {
    return <div>Loading banners...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bannersData.length) {
    return <div>No banners available</div>;
  }

  return (
    <section className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 ">
      <div className="max-w-screen-xl mx-auto py-15 px-4 md:px-8 ">
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
        >
          <CarouselContent className="space-x-2 ml-1">
            {bannersData.map((data) => (
              <CarouselItem
                key={data.id}
                className={`relative rounded-xl flex flex-col-reverse md:flex-row items-center justify-evenly p-2`}
              >
                {/* ... rest of your JSX remains exactly the same ... */}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-5" />
          <CarouselNext className="right-5" />
        </Carousel>
      </div>
    </section>
  );
};

export default HeroBannerOne;
