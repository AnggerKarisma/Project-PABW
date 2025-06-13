  // Misal di file: src/types/database.ts atau lib/database.ts

  // ---------------------------------------------------------------------------
  // BAGIAN 1: TIPE DASAR YANG IDEALNYA DI-GENERATE SUPABASE
  // Ganti bagian 'Database' ini dengan output aktual dari `supabase gen types typescript ...`
  // ---------------------------------------------------------------------------
  export type Json =
    | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

  export interface Database {
    public: {
      Tables: {
        banners: {
          Row: {
            id: number;
            title: string | null;
            description: string | null;
            images: string[] | null;
            button: string | null;
            discount_text: string | null;
            link: string | null;
            created_at: string;
          };
          Insert: {
            id?: number; // Opsional karena auto-increment
            title?: string | null;
            description?: string | null;
            images?: string[] | null;
            button?: string | null;
            discount_text?: string | null;
            link?: string | null;
            created_at?: string;
          };
          Update: {
            // Semua field opsional saat update
            id?: number;
            title?: string | null;
            description?: string | null;
            images?: string[] | null;
            button?: string | null;
            discount_text?: string | null;
            link?: string | null;
            created_at?: string;
          };
          Relationships: [];
        };
        brands: {
          Row: { id: number; name: string | null; created_at: string; };
          Insert: { id?: number; name?: string | null; created_at?: string; };
          Update: { id?: number; name?: string | null; created_at?: string; };
          Relationships: [];
        };
        carts: {
          Row: { id: number; created_at: string; user_id: string; product_id: number; quantity: number; /* tambahkan selected_color?: string | null; jika ada */ };
          Insert: { id?: number; created_at?: string; user_id: string; product_id: number; quantity: number; };
          Update: { id?: number; created_at?: string; user_id?: string; product_id?: number; quantity?: number; };
          Relationships: [
            { foreignKeyName: "carts_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; },
            { foreignKeyName: "carts_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"]; }
          ];
        };
        categories: {
          Row: { id: number; name: string | null; description: string | null; image: string | null; created_at: string; };
          Insert: { id?: number; name?: string | null; description?: string | null; image?: string | null; created_at?: string; };
          Update: { id?: number; name?: string | null; description?: string | null; image?: string | null; created_at?: string; };
          Relationships: [];
        };
        colors: {
          Row: { id: number; created_at: string; name: string | null; hex_code: string | null; };
          Insert: { id?: number; created_at?: string; name?: string | null; hex_code?: string | null; };
          Update: { id?: number; created_at?: string; name?: string | null; hex_code?: string | null; };
          Relationships: [];
        };
        order_items: {
          Row: { id: number; order_id: string; product_id: number; quantity: number; price_per_unit: number; subtotal: number; };
          Insert: { id?: number; order_id: string; product_id: number; quantity: number; price_per_unit: number; /* subtotal biasanya generated */ };
          Update: { id?: number; order_id?: string; product_id?: number; quantity?: number; price_per_unit?: number; };
          Relationships: [
            { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"]; },
            { foreignKeyName: "order_items_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"]; }
          ];
        };
        orders: {
          Row: {
            id: string; order_number: string | null; buyer_id: string; seller_id: string; courier_id: string | null; status: Enums<"order_status_enum">;
            shipping_address: string | null; shipping_city: string | null; shipping_zip_code: string | null; shipping_phone: string | null;
            shipping_cost: number | null; total_amount: number; notes_for_courier: string | null; created_at: string; updated_at: string | null;
            processed_by_seller_at: string | null; courier_called_at: string | null; delivered_at: string | null; returned_to_seller_at: string | null;
          };
          Insert: { /* ... semua field opsional atau wajib ... */ id?: string; order_number?: string | null; buyer_id: string; seller_id: string; courier_id?: string | null; status?: Enums<"order_status_enum">; /* ... */ };
          Update: { /* ... semua field opsional ... */ id?: string; };
          Relationships: [
            { foreignKeyName: "orders_buyer_id_fkey"; columns: ["buyer_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; },
            { foreignKeyName: "orders_seller_id_fkey"; columns: ["seller_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; },
            { foreignKeyName: "orders_courier_id_fkey"; columns: ["courier_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; }
          ];
        };
        product_colors: {
          Row: { id: number; product_id: number; /* FK ke products.id (int8) */ color_id: number; /* FK ke colors.id (int8) */ created_at: string; };
          Insert: { id?: number; product_id: number; color_id: number; created_at?: string; };
          Update: { id?: number; product_id?: number; color_id?: number; created_at?: string; };
          Relationships: [
            { foreignKeyName: "product_colors_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"]; },
            { foreignKeyName: "product_colors_color_id_fkey"; columns: ["color_id"]; referencedRelation: "colors"; referencedColumns: ["id"]; }
          ];
        };
        products: {
          Row: {
            id: number; // Menggunakan 'id' sebagai nama kolom, tipe int8
            name: string | null; description: string | null; price: number; discount: number | null; rating: number | null;
            images: string[] | null; stockItems: number | null; aboutItem: string[] | null; created_at: string;
            diproduksi: string | null; // uuid, FK to profiles
            brand_id: number | null;   // int8, FK to brands
            category_id: number | null; // int8, FK to categories
          };
          Insert: { id?: number; name: string; /* ... field wajib lainnya ... */ images: string[]; stockItems: number; price: number; category_id: number; brand_id: number; /* ... */ };
          Update: { id?: number; /* ... semua field opsional ... */ };
          Relationships: [
            { foreignKeyName: "products_diproduksi_fkey"; columns: ["diproduksi"]; referencedRelation: "profiles"; referencedColumns: ["id"]; },
            { foreignKeyName: "products_brand_id_fkey"; columns: ["brand_id"]; referencedRelation: "brands"; referencedColumns: ["id"]; },
            { foreignKeyName: "products_category_id_fkey"; columns: ["category_id"]; referencedRelation: "categories"; referencedColumns: ["id"]; }
          ];
        };
        profiles: {
          Row: {
            id: string; updated_at: string | null; username: string | null; full_name: string | null; avatar_url: string | null;
            website: string | null; user_role: Enums<"user_role_enum"> | null; email: string | null; address: string | null;
            phone: string | null; city: string | null; zip_code: string | null; created_at: string | null; balance: number | null;
          };
          Insert: { id: string; updated_at?: string | null; /* ... */ };
          Update: { id?: string; /* ... */ };
          Relationships: [{ foreignKeyName: "profiles_id_fkey"; columns: ["id"]; referencedRelation: "users"; referencedColumns: ["id"]; referencedSchema: "auth"; }];
        };
        reviews: {
          Row: {
            id: number; product_id: number; /* FK ke products.id (int8) */ content: string | null; rating: number | null;
            image: string | null; /* Gambar lampiran ulasan */ date: string | null; /* atau hanya created_at */ created_at: string; user_id: string; /* FK ke profiles */
          };
          Insert: { /* ... */ id?: number; product_id: number; user_id: string; content: string; rating: number; date?: string | null; };
          Update: { /* ... */ id?: number; };
          Relationships: [
            { foreignKeyName: "reviews_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"]; },
            { foreignKeyName: "reviews_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; }
          ];
        };
        testimonials: {
          Row: { id: number; user_id: string; content: string | null; created_at: string; };
          Insert: { /* ... */ }; Update: { /* ... */ };
          Relationships: [{ foreignKeyName: "testimonials_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; }];
        };
        wishlist: {
          Row: { id: number; user_id: string; product_id: number; /* FK ke products.id (int8) */ created_at: string; };
          Insert: { /* ... */ }; Update: { /* ... */ };
          Relationships: [
            { foreignKeyName: "wishlist_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"]; },
            { foreignKeyName: "wishlist_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"]; }
          ];
        };
      };
      Views: { [_ in never]: never };
      Functions: { [_ in never]: never };
      Enums: {
        order_status_enum: | "diproses penjual" | "menunggu kurir" | "sedang dikirim" | "sampai di tujuan" | "dikirim balik" | "menunggu penjual" | "selesai" | "dibatalkan";
        user_role_enum: "Admin" | "courier" | "user";
      };
      CompositeTypes: { [_ in never]: never };
    };
  }

  // ----- TIPE UTILITAS BAWAAN SUPABASE (Salin dari output Supabase CLI yang lengkap) -----
  type PublicSchema = Database[Extract<keyof Database, "public">];
  export type Tables<
    PublicTableNameOrOptions extends | keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"]) : never = never
  > = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R } ? R : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends { Row: infer R } ? R : never
    : never;

  export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
  export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
  export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];


  // ----- TIPE KUSTOM SPESIFIK APLIKASI ANDA (Menggunakan Tables dan Enums dari atas) -----

  // Tipe untuk UserInfo yang mungkin Anda gunakan di UI (bisa di-subset dari Tables<'profiles'>)
  export type UserProfileInfo = Pick<
    Tables<'profiles'>,
    'id' | 'full_name' | 'avatar_url' | 'email' | 'phone' | 'address' | 'city' | 'zip_code' | 'user_role'
  >;

  // Tipe untuk Item Produk dalam Pesanan atau Keranjang (kombinasi data)
  export type ProductItemDisplayInfo = {
    product_id: Tables<'products'>['id'];
    name: string; // Diambil dari join dengan products
    quantity: number;
    imageUrl?: string | null; // Diambil dari join dengan products
    price_per_unit?: number;
    subtotal?: number;
  };

  // Tipe untuk Pesanan yang Digunakan di UI Kurir (bisa menggabungkan data)
  export type OrderDisplay = Omit<Tables<'orders'>, 'buyer_id' | 'seller_id' | 'courier_id' | 'status'> & {
    items: ProductItemDisplayInfo[];
    status: Enums<'order_status_enum'>; // Menggunakan tipe Enum
    buyer: UserProfileInfo; // Atau subset yang lebih spesifik
    seller: UserProfileInfo;
    courier?: UserProfileInfo | null;
  };

  // Tipe Review yang Digunakan di UI (mungkin dengan info user penulis)
  export type ReviewDisplay = Tables<'reviews'> & {
    // Jika user_id di reviews merujuk ke profiles untuk info penulis:
    profiles?: Pick<Tables<'profiles'>, 'full_name' | 'avatar_url'> | null; // Nama relasi 'profiles' jika di-select '*, profiles!user_id(*)'
  };

  // Tipe Produk utama yang akan sering Anda gunakan di UI
  export type ProductDetailed = Tables<'products'> & {
    categories: Pick<Tables<'categories'>, 'id' | 'name'> | null;
    brands: Pick<Tables<'brands'>, 'id' | 'name'> | null;
    reviews?: ReviewDisplay[] | null;
    // Untuk warna, jika Anda mengambilnya melalui product_colors:
    product_colors?: Array<{ colors: Pick<Tables<'colors'>, 'id' | 'name' | 'hex_code'> | null }> | null;
  };

  // Tipe untuk Item Keranjang Kustom
  export type CartItemData = { // Mengganti nama agar tidak bentrok jika ada CartItem lain
    cart_id?: Tables<'carts'>['id']; // ID dari tabel carts (PK), opsional jika belum disimpan
    product_id: Tables<'products'>['id'];
    name: string;
    price: number; // Harga jual saat ini (setelah diskon jika ada)
    quantity: number;
    image?: string | null; // Gambar utama produk
    selectedColor?: string | null;
    stockItems?: number; // Untuk validasi
  };

  // Konstanta untuk transisi status pesanan
  export const availableStatusTransitions: Record<Enums<'order_status_enum'>, Enums<'order_status_enum'>[]> = {
    "diproses penjual": ["menunggu kurir", "dibatalkan"],
    "menunggu kurir": ["sedang dikirim", "dikirim balik", "dibatalkan"],
    "sedang dikirim": ["sampai di tujuan", "dikirim balik"],
    "dikirim balik": ["menunggu penjual"],
    "sampai di tujuan": ["selesai"],
    "menunggu penjual": [],
    "selesai": [],
    "dibatalkan": [],
  };

  // Konstanta untuk status yang bisa dilihat kurir
  export const courierViewableStatuses: Enums<'order_status_enum'>[] = [
    "menunggu kurir",
    "sedang dikirim",
    "dikirim balik",
  ];

  // Tipe SearchParams Anda
  export type SearchParams = {
    page?: string;
    category?: string; // Ini akan berisi nama kategori (string)
    brand?: string;    // Ini akan berisi nama brand (string)
    search?: string;
    min?: string;
    max?: string;
    color?: string;    // Ini akan berisi nama warna (string)
  };
