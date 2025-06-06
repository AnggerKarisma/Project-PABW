'use client'
import { CartItem } from "@/types";
import { create } from "zustand";

interface CartState {
  cartItems: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTax: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
}



const STORAGE_KEY = "cart-items";

const useCartStore = create<CartState>((set) => {
  
  const isLocalStorageAvailable = typeof window !== "undefined" && window.localStorage;

  const initialCartItems = isLocalStorageAvailable && localStorage.getItem(STORAGE_KEY);
  const parsedCartItems: CartItem[] = initialCartItems ? JSON.parse(initialCartItems) : [];

  return {
    cartItems: parsedCartItems,

    
    addToCart: (newItem: CartItem): void => {
      set((state) => {
        const existingItem = state.cartItems.find((item) => item.id === newItem.id);
        return {
          cartItems: existingItem
            ? state.cartItems.map((item) =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            : [...state.cartItems, { ...newItem}],
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCartStore.getState().cartItems));
    },

    removeFromCart: (itemId: number): void => {
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== itemId),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCartStore.getState().cartItems));
    },

    updateQuantity: (itemId: number, newQuantity: number): void => {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCartStore.getState().cartItems));
    },

    clearCart: (): void => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    },

    getTotalItems: (): number => {
      return useCartStore.getState().cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },

    getTotalPrice: (): number => {
      let totalPrice = useCartStore
        .getState()
        .cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return totalPrice;
    },

    getTax: (): number => {
      // Calculate tax based on the total price (Example: 10% tax)
      return useCartStore.getState().getTotalPrice() * 0.1; // 10% tax
    },
    
    getShippingFee: (): number => {
      // Calculate shipping fee based on the total price (Example: $5 flat rate)
      return 5; // $5 flat rate
    },

    getTotalAmount: (): number => {
      return (
        useCartStore.getState().getTotalPrice() +
        useCartStore.getState().getTax() +
        useCartStore.getState().getShippingFee()
      );
    },

  };
});

export default useCartStore;
