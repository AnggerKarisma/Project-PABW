"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Label } from "recharts";
import { Button } from "@/components/ui/button"; // Asumsi dari shadcn/ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Asumsi dari shadcn/ui
import { AlertCircle, Info, CheckCircle } from "lucide-react"; // Ikon untuk pesan
import Image from "next/image"; // Untuk gambar item

// Impor tipe data dari file types.ts
import type { Order, OrderStatus } from "@/types"; // Sesuaikan path jika types.ts ada di tempat lain
import { availableStatusTransitions, courierViewableStatuses } from "@/types"; // Sesuaikan path

// Data dummy untuk pengembangan UI awal
const initialMockOrders: Order[] = [
  {
    id: "order-xyz-001",
    orderNumber: "ORD-2025-001",
    items: [
      {
        id: "prod-a1",
        name: "Laptop Pro Max 16 inch",
        quantity: 1,
        imageUrl: "/placeholder/laptop.jpg",
      },
    ],
    status: "menunggu kurir",
    buyer: {
      id: "buyer-01",
      name: "Budi Santoso",
      address: "Jl. Mawar No. 1, Jakarta",
      phone: "081234567890",
    },
    seller: {
      id: "seller-01",
      name: "Toko Elektronik Jaya",
      address: "Jl. Melati No. 2, Jakarta",
      phone: "089876543210",
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam lalu
  },
  {
    id: "order-xyz-002",
    orderNumber: "ORD-2025-002",
    items: [
      {
        id: "prod-b1",
        name: "Smartphone Canggih X",
        quantity: 2,
        imageUrl: "/placeholder/smartphone.jpg",
      },
    ],
    status: "sedang dikirim",
    courierId: "courier- 当前ID", // Anggap ini ID kurir yang sedang login
    buyer: {
      id: "buyer-02",
      name: "Citra Lestari",
      address: "Jl. Anggrek No. 3, Bandung",
      phone: "082345678901",
    },
    seller: {
      id: "seller-02",
      name: "Gadget Store Bandung",
      address: "Jl. Kembang No. 4, Bandung",
      phone: "087654321098",
    },
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 jam lalu
  },
  {
    id: "order-xyz-003",
    orderNumber: "ORD-2025-003",
    items: [
      {
        id: "prod-c1",
        name: "Kamera Mirrorless Z",
        quantity: 1,
        imageUrl: "/placeholder/kamera.jpg",
      },
    ],
    status: "dikirim balik",
    courierId: "courier- 当前ID",
    buyer: {
      id: "buyer-03",
      name: "Doni Firmansyah",
      address: "Jl. Cendana No. 5, Surabaya",
      phone: "083456789012",
    },
    seller: {
      id: "seller-01",
      name: "Toko Elektronik Jaya",
      address: "Jl. Melati No. 2, Jakarta",
      phone: "089876543210",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 hari lalu
  },
];

// Fungsi utilitas untuk format tanggal (bisa dipindah ke file utils)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CourierPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "semua">(
    "semua"
  );
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // TODO: Nanti, Anda akan mengambil data kurir yang sedang login dari Supabase Auth
  // const [currentCourierId, setCurrentCourierId] = useState<string | null>("courier-当前ID"); // Contoh ID kurir

  // Fungsi untuk mengambil data pesanan (menggunakan mock untuk sekarang)
  const fetchOrders = useCallback(() => {
    setIsLoading(true);
    setMessage(null);
    // Simulasi API call
    setTimeout(() => {
      // TODO: Ganti dengan logika fetch ke Supabase
      // const { data, error } = await supabase.from('orders').select(...).in('status', courierViewableStatuses);
      // if (error) { setMessage({type: 'error', text: error.message}); setOrders([]) }
      // else { setOrders(data || []); }
      setOrders(initialMockOrders); // Menggunakan data mock
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Efek untuk memfilter pesanan
  useEffect(() => {
    let tempFilteredOrders = orders;
    if (statusFilter !== "semua") {
      tempFilteredOrders = tempFilteredOrders.filter(
        (order) => order.status === statusFilter
      );
    }
    // TODO: Jika menggunakan currentCourierId, filter juga pesanan yang relevan untuk kurir tersebut
    // misalnya: order.courierId === currentCourierId || order.status === "menunggu kurir"
    setFilteredOrders(tempFilteredOrders);
  }, [statusFilter, orders /*, currentCourierId */]);

  // Fungsi untuk menangani perubahan status (menggunakan data dummy)
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setMessage(null);
    console.log(
      `KURIR: Mengubah status order ${orderId} menjadi ${newStatus} (Dummy)`
    );

    // Simulasi optimistik update
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus /* updatedAt: new Date().toISOString() */,
            }
          : order
      )
    );
    setMessage({
      type: "success",
      text: `Status pesanan ${orderId} berhasil diubah menjadi ${newStatus}.`,
    });

    // TODO: Implementasi update status ke Supabase
    // const { error: updateError } = await supabase
    //   .from("orders")
    //   .update({ status: newStatus, courier_id: currentCourierId, /* timestamp yang relevan */ })
    //   .eq("id", orderId)
    //   // Mungkin tambahkan kondisi .eq('status', status_lama) untuk mencegah race condition
    // if (updateError) {
    //   setMessage({type: 'error', text: `Gagal update: ${updateError.message}`});
    //   fetchOrders(); // Kembalikan ke data asli jika gagal
    // }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-xl dark:text-white">Memuat pesanan...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Dashboard Kurir Mahakam Store
        </h1>

        {message && (
          <div
            className={`p-3 rounded-md text-sm mb-4 flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-200"
                : message.type === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-200"
            }`}
          >
            {message.type === "success" && <CheckCircle size={18} />}
            {message.type === "error" && <AlertCircle size={18} />}
            {message.type === "info" && <Info size={18} />}
            {message.text}
          </div>
        )}

        <div className="mb-6">
          <Label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filter Status Pesanan:
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as OrderStatus | "semua")
            }
          >
            <SelectTrigger className="w-full md:w-[280px] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Pilih status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status (Untuk Kurir)</SelectItem>
              {courierViewableStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
            Tidak ada pesanan yang cocok dengan filter "{statusFilter}".
          </p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2 sm:mb-0">
                    Pesanan: {order.orderNumber}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                      order.status === "menunggu kurir"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100"
                        : order.status === "sedang dikirim"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                        : order.status === "dikirim balik"
                        ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                        : order.status === "sampai di tujuan"
                        ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                        : order.status === "menunggu penjual"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tanggal Dibuat: {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item:
                  </h4>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/40 rounded-md mb-2"
                    >
                      <Image
                        src={
                          item.imageUrl || "/placeholder/default-product.png"
                        } // Sediakan placeholder
                        alt={item.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded object-cover border dark:border-gray-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Jumlah: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Info Pembeli:
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Nama:</strong> {order.buyer.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Alamat:</strong> {order.buyer.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Telp:</strong> {order.buyer.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Info Penjual:
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Nama:</strong> {order.seller.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Alamat:</strong> {order.seller.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Telp:</strong> {order.seller.phone}
                    </p>
                  </div>
                </div>

                {availableStatusTransitions[order.status] &&
                  availableStatusTransitions[order.status].length > 0 && (
                    <div className="mt-6 pt-4 border-t dark:border-gray-600">
                      <Label
                        htmlFor={`status-change-${order.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Ubah Status Pesanan Ini:
                      </Label>
                      <Select
                        onValueChange={(newStatus) => {
                          if (newStatus) {
                            handleStatusChange(
                              order.id,
                              newStatus as OrderStatus
                            );
                          }
                        }}
                        // defaultValue={order.status} // Tidak perlu, biarkan placeholder
                      >
                        <SelectTrigger
                          id={`status-change-${order.id}`}
                          className="w-full md:w-[280px] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        >
                          <SelectValue placeholder="Pilih status baru..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStatusTransitions[order.status].map(
                            (nextStatus) => (
                              <SelectItem key={nextStatus} value={nextStatus}>
                                {nextStatus.charAt(0).toUpperCase() +
                                  nextStatus.slice(1)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourierPage;
