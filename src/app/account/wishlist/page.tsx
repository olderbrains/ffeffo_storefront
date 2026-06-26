'use client';

import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductCard, type CardProduct } from '@/components/product/product-card';
import { api } from '@/lib/api/client';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchProducts() {
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const data = await api.get<{ items: CardProduct[] }>(
          `/products?ids=${ids.join(',')}`,
        );
        setProducts(data.items || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchProducts();
  }, [ids, mounted]);

  const handleClearAll = () => {
    const store = useWishlistStore.getState();
    ids.forEach((id) => store.toggle(id));
  };

  if (!mounted || loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-lg border p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-serif text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Save items you love to revisit them later.
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-block rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
          >
            Browse Products
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {ids.length} {ids.length === 1 ? 'Item' : 'Items'} Saved
        </h2>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {products.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
