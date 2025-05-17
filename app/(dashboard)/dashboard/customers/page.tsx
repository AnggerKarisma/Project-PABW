import SearchCustomer from "@/components/dashboard/customer/SearchCustomer";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import Image from "next/image";
import React, { Suspense } from "react";

const CustomersPage = () => {
  // Data dummy untuk demo
  const dummyCustomers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      address: "Jalan Utama 123, Kota Contoh, Indonesia",
      image: "/images/people/person.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "9876543210",
      address: "Jalan Elm 456, Kota Lain, Indonesia",
      image: "/images/people/person.jpg",
    },
  ];

  return (
    <div className="max-w-screen-xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ">
          Pelanggan
        </h2>
        <SearchCustomer />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y dark:text-slate-100 divide-gray-200 dark:divide-gray-700 border">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Telepon
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Alamat
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Gambar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {dummyCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {customer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Image
                    width={40}
                    height={40}
                    src={customer.image}
                    alt={customer.name}
                    className="h-10 w-10 rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Suspense fallback={<Loader />}>
        <Pagination totalPages={5} currentPage={1} pageName="customerpage" />
      </Suspense>
    </div>
  );
};

export default CustomersPage;
