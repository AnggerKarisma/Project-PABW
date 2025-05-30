import { Input } from '@/components/ui/input'
import React from 'react'

const OrderSearch = () => {
  return (
    <div>
      <Input 
        placeholder="Cari pesanan berdasarkan ID atau status" 
        className="w-full md:w-96 p-5 rounded-md" 
      />
    </div>
  )
}

export default OrderSearch
