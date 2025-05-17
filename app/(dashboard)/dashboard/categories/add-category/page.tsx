import CategoryForm from '@/components/dashboard/forms/CategoryForm'
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

const AddCategoryPage = () => {
  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard','/categories']} pageText='tambah kategori'/>
      <CategoryForm />
    </div>
  )
}

export default AddCategoryPage
