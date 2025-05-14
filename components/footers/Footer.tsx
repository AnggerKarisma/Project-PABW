import React from "react";
import { Separator } from "../ui/separator";
import { FaFacebook, FaTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import Link from 'next/link'
import { dummyCategories } from "@/data/category/categoryData";
import Logo from "../logo/Logo";


const Footer = () => {
  return (
    <footer className=" bg-gray-700 text-white py-8 px-4 md:px-8">
<div className="max-w-screen-xl mx-auto p-4 md:p-8 flex md:flex-row flex-wrap gap-4 md:gap-2 justify-between">
  <div className="flex flex-col space-y-4 mb-8 md:mb-0">
    <Logo />
    <p>Toko serba ada untuk semua kebutuhan elektronik Anda.</p>
    <div className="flex space-x-4">
      <Link href="www.facebook.com" className="">
        <FaFacebook size={30} />
      </Link>
      <Link href="www.x.com" className="">
        <FaTwitter size={30} />
      </Link>
      <Link href="www.instagram.com" className="">
        <FaInstagramSquare size={30} />
      </Link>
    </div>
  </div>

  <div className="flex flex-col space-y-4">
    <h3 className="text-xl font-semibold">Kategori</h3>
    <ul className="space-y-2">
      {dummyCategories.map(category => (
        <li key={category.name}>
          <Link href={`/shop?category=${category.name}`} className="">
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  <div className="flex flex-col space-y-4">
    <h3 className="text-xl font-semibold">Navigasi</h3>
    <ul className="space-y-2">
      <li>
        <Link href="/" className="">
          Beranda
        </Link>
      </li>
      <li>
        <Link href="/about" className="">
          Tentang Kami
        </Link>
      </li>
      <li>
        <Link href="/contact" className="">
          Hubungi Kami
        </Link>
      </li>
      <li>
        <Link href="/shop" className="">
          Belanja
        </Link>
      </li>
    </ul>
  </div>

  <div className="flex flex-col space-y-4">
    <h3 className="text-xl font-semibold">Dukungan</h3>
    <ul className="space-y-2">
      <li>
        <Link href="/help" className="">
          Pusat Bantuan
        </Link>
      </li>
      <li>
        <Link href="#" className="">
          Pengembalian & Pengembalian Dana
        </Link>
      </li>
      <li>
        <Link href="#" className="">
          Syarat Layanan
        </Link>
      </li>
      <li>
        <Link href="#" className="">
          Kebijakan Privasi
        </Link>
      </li>
    </ul>
  </div>
</div>

      <hr className="w-full h-[2px] bg-white" />
      <div className="text-center mt-8">
        <p>&copy; 2025 Mahakam Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
