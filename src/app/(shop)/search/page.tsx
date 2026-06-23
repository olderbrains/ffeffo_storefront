'use client';

import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api/client';

interface Product {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  images: { url: string; alt?: string }[];
  ratings: { average: number; count: number };
  brandId?: { name: string };
}

const POPULAR = ['Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Sports'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setProducts([]);
      setSearched(false);
      return;
    }
    setSearching(true);
    try {
      const data = await api.get<{ items: Product[] }>(`/products?q=${encodeURIComponent(term.trim())}&limit=12`);
      setProducts(data.items || []);
    } catch {
      setProducts([]);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setProducts([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const handlePopularClick = (term: string) => {
    setQuery(term);
    doSearch(term);
  };

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products, categories, brands..."
            className="w-full rounded-2xl border border-black/[0.08] bg-white py-4 pl-12 pr-4 text-lg outline-none transition-all duration-200 focus:border-violet/40 focus:ring-2 focus:ring-violet/20 placeholder:text-muted-foreground/60"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {!query.trim() && !searched && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">Popular Searches</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularClick(term)}
                className="cursor-pointer rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm transition-all duration-200 hover:bg-black/[0.03] hover:border-black/15"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {searching && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-secondary animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!searching && searched && products.length === 0 && (
        <div className="mt-12 text-center">
          <p className="font-medium">No products found for &quot;{query}&quot;</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term or browse our categories.
          </p>
        </div>
      )}

      {!searching && products.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="cursor-pointer group block space-y-3"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/[0.05] bg-secondary/30 transition-all duration-500 group-hover:border-black/15 group-hover:shadow-lg group-hover:shadow-violet/5">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    {product.salePrice && product.salePrice < product.basePrice && (
                      <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-pink to-violet px-2.5 py-0.5 text-[10px] font-bold text-white">
                        SALE
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-1">
                    <h3 className="text-sm font-medium line-clamp-2 transition-colors group-hover:text-violet">{product.name}</h3>
                    {product.brandId && (
                      <p className="text-xs text-muted-foreground">{product.brandId.name}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        ₹{(product.salePrice || product.basePrice).toLocaleString('en-IN')}
                      </span>
                      {product.salePrice && product.salePrice < product.basePrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.basePrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {product.ratings.count > 0 && (
                        <span className="ml-auto flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {product.ratings.average}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
