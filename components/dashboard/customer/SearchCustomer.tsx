import { Input } from '@/components/ui/input'
import React from 'react'

const SearchCustomer = () => {
  return (
    <div>
      <Input 
        placeholder='Cari pelanggan berdasarkan nama atau email' 
        className='rounded-md p-5 w-full lg:w-96' 
      />
    </div>
  )
}

export default SearchCustomer
