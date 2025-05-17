import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const OrderDetails = () => {

  // ambil data order berdasarkan orderId dari params di sini
  const order = {
    orderNumber: "ORD123456",
    customerName: "John Doe",
    date: "2024-04-01",
    status: "Dikirim",
    shippingAddress: "Jalan Utama 123",
    city: "Jakarta",
    country: "Indonesia",
    products: [
      {
        id: 1,
        name: "Apple watch 9 pro",
        price: 50,
        quantity: 2,
        image: "/images/products/apple-watch-9-3-removebg-preview.png",
      },
      {
        id: 2,
        name: "Apple watch se 9",
        price: 50,
        quantity: 2,
        image: "/images/products/apple-watch-se-2-removebg-preview.png",
      },
    ],
    total: 190,
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Detail Pesanan
      </h2>

      <Separator className="dark:bg-gray-500 my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Informasi Pesanan
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Nomor Pesanan: {order.orderNumber}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Nama Pelanggan: {order.customerName}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Tanggal: {order.date}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Status:{" "}
            <span
              className={`inline-flex text-sm font-semibold rounded-full px-2 ${
                order.status === "Dikirim"
                  ? "bg-green-100 text-green-800"
                  : order.status === "Menunggu"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Informasi Pengiriman
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Alamat: {order.shippingAddress}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Kota: {order.city}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Negara: {order.country}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Produk Pesanan
        </h3>
        <ul className="dark:divide-gray-700 my-4 space-y-2">
          {order.products.map((product) => (
            <li key={product.id} className="">
              <div className="flex justify-between items-center !border dark:border-gray-500 px-2 rounded-md ">
                <p className="text-gray-900 dark:text-white text-lg font-semibold">{product.name}</p>
                <Image
                  src={product.image}
                  alt="gambar produk"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <p className="text-gray-700 dark:text-gray-300">
                  Jumlah: {product.quantity}
                </p>
                <p>Harga: ${product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Total :
        </h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          ${order.total}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
