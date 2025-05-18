import React from 'react';
import AksiPesanan from './OrderActions'; // Pastikan nama file juga diubah jika kamu mengganti nama file OrderActions

const BagianPesananTerbaru = () => {
  // Data dummy untuk pesanan terbaru
  const pesananTerbaru = [
    { id: 1, orderNumber: 'ORD123456', customerName: 'John Doe', date: '2024-04-01', status: 'Dikirim' },
    { id: 2, orderNumber: 'ORD123457', customerName: 'Jane Smith', date: '2024-04-02', status: 'Menunggu' },
    { id: 3, orderNumber: 'ORD123458', customerName: 'Alice Johnson', date: '2024-04-03', status: 'Terkirim' },
    { id: 4, orderNumber: 'ORD123459', customerName: 'Bob Williams', date: '2024-04-04', status: 'Dikirim' },
    { id: 5, orderNumber: 'ORD123460', customerName: 'Emily Brown', date: '2024-04-05', status: 'Menunggu' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pesanan Terbaru</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Pesanan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pesananTerbaru.map((pesanan) => (
              <tr key={pesanan.id} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">{pesanan.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pesanan.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pesanan.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pesanan.status === 'Dikirim'
                        ? 'bg-green-100 text-green-800'
                        : pesanan.status === 'Menunggu'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {pesanan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AksiPesanan />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BagianPesananTerbaru;
