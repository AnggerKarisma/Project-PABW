import React from 'react'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const ViewCart = () => {
  return (
    <Link
      href={'/cart'}
      className="w-full p-2 border rounded-full text-xl hover:ring-2 ring-slate-500 flex items-center justify-center gap-4"
    >
      <ShoppingBag /> Lihat Keranjang
    </Link>
  )
}

export default ViewCart
