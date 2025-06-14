"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import {
  Home,
  ClipboardList,
  Box,
  Layers,
  Book,
  Users,
  Images,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DashboardMobileHeader = () => {
  const pathname = usePathname();

  const dashboardLinks = [
    {
      link: "/dashboard",
      label: "Beranda",
      icon: <Home size={20} />,
      isActive: pathname === "/dashboard",
    },
    {
      link: "/dashboard/orders",
      label: "Pesanan",
      icon: <ClipboardList size={20} />,
      isActive: pathname.includes("dashboard/orders"),
    },
    {
      link: "/dashboard/products",
      label: "Produk",
      icon: <Box size={20} />,
      isActive: pathname.includes("dashboard/products"),
    },
    {
      link: "/dashboard/categories",
      label: "Kategori",
      icon: <Layers size={20} />,
      isActive: pathname.includes("dashboard/categories"),
    },
    {
      link: "/dashboard/banners",
      label: "Banner",
      icon: <Images size={20} />,
      isActive: pathname.includes("dashboard/banners"),
    },
    {
      link: "/dashboard/customers",
      label: "Pelanggan",
      icon: <Users size={20} />,
      isActive: pathname.includes("dashboard/customers"),
    },
  ];

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu Mobile</SheetTitle>
            <SheetDescription>
              <ul className="flex flex-col gap-2 items-start justify-center">
                {dashboardLinks.map((link) => (
                  <li key={link.label} className="w-full">
                    <Link
                      href={link.link}
                      className={cn(
                        "flex items-center text-lg w-full gap-2  p-2 rounded-md transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-800",
                        link.isActive && "bg-slate-300  dark:bg-slate-700"
                      )}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardMobileHeader;
