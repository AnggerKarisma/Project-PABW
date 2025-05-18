import Link from 'next/link';
import React from 'react';

const MyAccountPage = () => {
  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          Akun Saya
        </h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Informasi Pribadi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <p className="text-gray-800 dark:text-white">Mahakam Store</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Email</label>
              <p className="text-gray-800 dark:text-white">mahakamstore@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className='flex items-center justify-between'>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Alamat</h2>
            <Link href={'/my-account/edit'} className='p-2 rounded-md border'>Ubah Alamat</Link>
          </div>
          
          <div>
            <p className="text-gray-800 dark:text-white">Kampus ITK</p>
            <p className="text-gray-800 dark:text-white">Karang Joang, Balikpapan</p>
            <p className="text-gray-800 dark:text-white">Indonesia</p>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Riwayat Pesanan</h2>
          <div>
            {/* Tampilkan riwayat pesanan */}
            {/* Anda bisa melakukan map terhadap pesanan pengguna di sini */}
            <div className="border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-800 dark:text-white">Pesanan #12345</p>
                <p className="text-gray-800 dark:text-white">Rp XXX.XX</p>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Tanggal: MM/DD/YYYY</p>
              <p className="text-gray-500 dark:text-gray-400">Status: Dikirim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
