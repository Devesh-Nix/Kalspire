import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ColorVariant } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedColor?: ColorVariant) => void;
  removeItem: (productId: string, colorId?: string) => void;
  updateQuantity: (productId: string, quantity: number, colorId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedColor) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id && 
            ((!selectedColor && !item.selectedColor) || (selectedColor?.id === item.selectedColor?.id))
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id &&
                ((!selectedColor && !item.selectedColor) || (selectedColor?.id === item.selectedColor?.id))
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { productId: product.id, product, quantity, selectedColor }],
          };
        });
      },

      removeItem: (productId, colorId) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.productId !== productId) return true;
            if (!colorId) return false;
            return item.selectedColor?.id !== colorId;
          }),
        }));
      },

      updateQuantity: (productId, quantity, colorId) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            if (colorId && item.selectedColor?.id !== colorId) return item;
            if (!colorId && item.selectedColor) return item;
            return { ...item, quantity };
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
