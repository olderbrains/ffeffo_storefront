'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { selectCartSubtotal, useCartStore } from '@/lib/stores/cart-store';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore(selectCartSubtotal);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container py-8" />;
  }

  if (items.length === 0) {
    return (
      <motion.div
        className="container py-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto h-20 w-20 rounded-2xl bg-secondary/50 border border-black/[0.05] flex items-center justify-center mb-6">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse our catalog and add something you love.</p>
        <Link
          href="/"
          className="cursor-pointer mt-8 inline-block rounded-xl bg-gradient-to-r from-violet to-violet-dark px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/25"
        >
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item, i) => (
            <motion.div
              key={item.variantId}
              className="flex gap-4 rounded-2xl border border-black/[0.05] bg-white p-4 transition-all duration-200 hover:border-black/10 hover:shadow-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/products/${item.slug}`}
                className="cursor-pointer h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-black/[0.05] bg-secondary/30"
              >
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.slug}`} className="cursor-pointer font-medium hover:text-violet transition-colors">
                    {item.name}
                  </Link>
                  {item.variantLabel !== 'Default' && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center rounded-xl border border-black/[0.08] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="cursor-pointer px-2.5 py-1.5 hover:bg-black/[0.03] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="cursor-pointer px-2.5 py-1.5 hover:bg-black/[0.03] transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="cursor-pointer text-muted-foreground hover:text-pink transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order summary */}
        <div className="h-fit glass-card p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-cyan">Free</span>
            </div>
            <div className="border-t border-black/[0.04] pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-gradient-violet">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="cursor-pointer mt-6 block w-full rounded-xl bg-gradient-to-r from-violet to-violet-dark px-4 py-3.5 text-center text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/25"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="cursor-pointer mt-3 block w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
