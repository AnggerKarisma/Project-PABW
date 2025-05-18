import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const OrderActions = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
            <MoreHorizontal />
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-start">
          <Link
            href={`/dashboard/orders/id`}
            className="py-2 px-4 rounded-md w-full block hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            Lihat Detail
          </Link>
          <Select>
            <SelectTrigger className="w-full text-base px-4 border-none outline-none focus:ring-offset-0 focus:ring-0 focus-within:outline-none hover:bg-slate-200 dark:hover:bg-slate-900">
              <SelectValue placeholder="Ubah Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="on the way">Sedang Dikirim</SelectItem>
              <SelectItem value="delivered">Terkirim</SelectItem>
              <SelectItem value="shiped">Dikirim</SelectItem>
            </SelectContent>
          </Select>
          <button className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md">
            Batalkan Pesanan
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrderActions;
