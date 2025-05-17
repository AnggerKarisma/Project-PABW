"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Heart,
  HelpCircle,
  ListOrdered,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const AccountPopover = () => {
  const pathname = usePathname();

  const userLinks = [
    {
      link: "/my-account",
      label: "Akun Saya",
      icon: <User size={18} />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Daftar Keinginan",
      icon: <Heart size={18} />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "Pesanan Saya",
      icon: <ListOrdered size={18} />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Bantuan",
      icon: <HelpCircle size={18} />,
      isActive: pathname.includes("/help"),
    },
  ];

  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 p-2 rounded-md">
          <User size={25} />
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl p-4 w-60">
          <ul className="space-y-1">
            <div className="text-center">
              <UserAvatar />
            </div>
            <Separator className="!my-2" />
            {userLinks.map((link) => (
              <Link
                key={link.link}
                href={link.link}
                className={cn(
                  "flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md text-sm",
                  link.isActive && "bg-gray-200 dark:bg-gray-800"
                )}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <Separator className="!my-2" />
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-sm w-full"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;
