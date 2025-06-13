// src/components/others/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Contoh ikon pemisah

interface BreadcrumbLink {
  label: string;
  href: string;
}

interface BreadcrumbComponentProps {
  links: BreadcrumbLink[]; // Array of objects
  pageText: string;
}

const BreadcrumbComponent: React.FC<BreadcrumbComponentProps> = ({
  links,
  pageText,
}) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            {/* Anda bisa pakai ikon Home di sini */}
            Home
          </Link>
        </li>
        {links.map((link, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              <Link
                href={link.href}
                className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            </div>
          </li>
        ))}
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
            <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-300">
              {pageText}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default BreadcrumbComponent;
