export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: {
          button: string | null
          created_at: string
          description: string | null
          discount_text: string | null
          id: number
          images: string[] | null
          link: string | null
          title: string | null
        }
        Insert: {
          button?: string | null
          created_at?: string
          description?: string | null
          discount_text?: string | null
          id?: number
          images?: string[] | null
          link?: string | null
          title?: string | null
        }
        Update: {
          button?: string | null
          created_at?: string
          description?: string | null
          discount_text?: string | null
          id?: number
          images?: string[] | null
          link?: string | null
          title?: string | null
        }
        Relationships: []
      }
      blog_post_contents: {
        Row: {
          alt: string | null
          blog_id: number | null
          created_at: string
          id: number
          src: string | null
          text: string | null
          type: string | null
        }
        Insert: {
          alt?: string | null
          blog_id?: number | null
          created_at?: string
          id?: number
          src?: string | null
          text?: string | null
          type?: string | null
        }
        Update: {
          alt?: string | null
          blog_id?: number | null
          created_at?: string
          id?: number
          src?: string | null
          text?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_contents_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          created_at: string
          date: string | null
          excerpt: string | null
          id: number
          image: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string
          date?: string | null
          excerpt?: string | null
          id?: number
          image?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string
          date?: string | null
          excerpt?: string | null
          id?: number
          image?: string | null
          title?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      carts: {
        Row: {
          category: string | null
          created_at: string
          discount: number | null
          id: number
          image: string | null
          name: string | null
          price: number | null
          quantity: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          discount?: number | null
          id?: number
          image?: string | null
          name?: string | null
          price?: number | null
          quantity?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          discount?: number | null
          id?: number
          image?: string | null
          name?: string | null
          price?: number | null
          quantity?: number | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          about_item: string[] | null
          brand: string | null
          category: string | null
          color: string[] | null
          created_at: string
          description: string | null
          discount: number | null
          id: number
          images: string[] | null
          name: string | null
          price: number | null
          rating: number | null
          stock_items: number | null
        }
        Insert: {
          about_item?: string[] | null
          brand?: string | null
          category?: string | null
          color?: string[] | null
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: number
          images?: string[] | null
          name?: string | null
          price?: number | null
          rating?: number | null
          stock_items?: number | null
        }
        Update: {
          about_item?: string[] | null
          brand?: string | null
          category?: string | null
          color?: string[] | null
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: number
          images?: string[] | null
          name?: string | null
          price?: number | null
          rating?: number | null
          stock_items?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          date: string | null
          id: number
          image: string | null
          product_id: number | null
          rating: number | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          id?: number
          image?: string | null
          product_id?: number | null
          rating?: number | null
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          id?: number
          image?: string | null
          product_id?: number | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string | null
          created_at: string
          designation: string | null
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          designation?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          designation?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
