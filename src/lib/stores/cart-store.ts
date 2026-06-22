'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  variantId: string;
  sku: string;
  variantLabel: string;
  price: number;
  image?: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  /** Adds (or increments) an item, clamped to available stock. */
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock) }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, item.maxStock) }],
          };
        }),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'speffo-cart' },
  ),
);

/** Total item count (sum of quantities). */
export const selectCartCount = (s: CartState): number =>
  s.items.reduce((n, i) => n + i.quantity, 0);

/** Subtotal in rupees. */
export const selectCartSubtotal = (s: CartState): number =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
