"use client";
import Link from "next/link";
import React from "react";
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
import { cn } from "@/lib/utils";

const SidebarDashboard = () => {
  const pathname = usePathname();

  const tautanDashboard = [
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
    <nav className="w-64 min-h-[88vh] px-2 py-4 border-r-2 hidden lg:block">
      {/* Tautan Sidebar */}
      <div>
        <ul className="flex flex-col gap-2 items-start justify-center">
          {tautanDashboard.map((tautan) => (
            <li key={tautan.label} className="w-full">
              <Link
                href={tautan.link}
                className={cn(
                  "flex items-center text-lg w-full gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-800",
                  tautan.isActive && "bg-slate-300 dark:bg-slate-700"
                )}
              >
                {tautan.icon}
                <span>{tautan.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SidebarDashboard;
