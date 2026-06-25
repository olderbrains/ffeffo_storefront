'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ProductCard, type CardProduct } from '@/components/product/product-card';
import { api } from '@/lib/api/client';

type Product = CardProduct;

const POPULAR = ['Tee', 'Linen', 'Pant', 'Dress', 'Jacket', 'Tote'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setProducts([]);
      setSearched(false);
      return;
    }
    setSearchError(false);
    setSearching(true);
    try {
      const data = await api.get<{ items: Product[] }>(
        `/products?search=${encodeURIComponent(term.trim())}&limit=16`,
      );
      setProducts(data.items || []);
    } catch {
      setProducts([]);
      setSearchError(true);
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
      className="container py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Search</h1>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <input
            type="search"
            placeholder="Search for tees, linen, pants…"
            className="w-full rounded-sm border border-border bg-card py-4 pl-12 pr-4 text-lg outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-forest/50"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {!query.trim() && !searched && (
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h2 className="eyebrow text-clay">Popular Searches</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularClick(term)}
                className="cursor-pointer rounded-sm border border-border px-4 py-2 text-sm transition-colors hover:border-forest/50 hover:text-forest"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {searching && (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>
      )}

      {!searching && searched && products.length === 0 && !searchError && (
        <div className="mt-14 text-center">
          <p className="font-medium">No products found for &quot;{query}&quot;</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term or browse our collections.
          </p>
        </div>
      )}

      {!searching && searchError && (
        <div className="mt-14 text-center">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn&apos;t complete your search. Please try again.
          </p>
          <button
            onClick={() => doSearch(query)}
            className="mt-4 rounded-sm bg-forest px-5 py-2.5 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
          >
            Retry
          </button>
        </div>
      )}

      {!searching && products.length > 0 && (
        <div className="mt-10">
          <p className="mb-6 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
