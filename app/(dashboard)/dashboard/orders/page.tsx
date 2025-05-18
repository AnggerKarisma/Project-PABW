import OrderActions from "@/components/dashboard/order/OrderActions";
import OrderSearch from "@/components/dashboard/order/OrderSearch";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import React, { Suspense } from "react";

const OrdersPage = () => {
  // data dummy untuk pesanan
  const orders = [
    {
      id: 1,
      orderNumber: "ORD123456",
      customerName: "John Doe",
      date: "2024-04-01",
      status: "Dikirim",
    },
    {
      id: 2,
      orderNumber: "ORD123457",
      customerName: "Jane Smith",
      date: "2024-04-02",
      status: "Menunggu",
    },
    {
      id: 3,
      orderNumber: "ORD123458",
      customerName: "Alice Johnson",
      date: "2024-04-03",
      status: "Terkirim",
    },
    {
      id: 4,
      orderNumber: "ORD123459",
      customerName: "Bob Williams",
      date: "2024-04-04",
      status: "Dikirim",
    },
    {
      id: 5,
      orderNumber: "ORD123460",
      customerName: "Emily Brown",
      date: "2024-04-05",
      status: "Menunggu",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pesanan
        </h2>
        <OrderSearch />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500 rounded-md">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nomor Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Pelanggan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "Dikirim"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderActions />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ganti data ini dengan data asli Anda */}
        <Suspense fallback={<Loader />}>
          <Pagination currentPage={1} pageName="halamanpesanan" totalPages={10} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrdersPage;
