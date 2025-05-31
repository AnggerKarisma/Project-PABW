// change or modify the types as your requirement

import { Tables } from "./database.types";

export type Product = Tables<'products'> &{reviews: Tables<'reviews'>[]};

export type Review = Tables<'reviews'>;
  
export type ProductDisplay = Omit<Tables<'products'>, 'created_at'> & {
  reviews: {
    content: string;
    rating: number;
    author: string;
    image: string;
    date: Date;
  }[];
};

export type SearchParams = {
  page: string;
  category: string;
  brand: string;
  search: string;
  min: string;
  max: string;
  color: string;
};

export type CartItem = Product & {
  selectedColor: string;
  quantity: number;
};
