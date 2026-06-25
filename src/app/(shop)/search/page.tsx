'use client';

import { motion } from 'framer-motion';
import { Grid3X3, Package, Search, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ProductCard, type CardProduct } from '@/components/product/product-card';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const POPULAR = ['Tee', 'Linen', 'Perfume', 'Pant', 'Dress', 'Jacket', 'Tote'];

interface CategoryHit {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
}

interface BrandHit {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface SearchResults {
  products: CardProduct[];
  categories: CategoryHit[];
  brands: BrandHit[];
  total: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) { setResults(null); setSearched(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(term.trim())}&limit=16`);
      const json = await res.json();
      setResults(json.data as SearchResults);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // Run immediately on mount if URL had ?q=
  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      } else {
        router.replace('/search', { scroll: false });
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const total = results ? results.products.length + results.categories.length + results.brands.length : 0;

  return (
    <motion.div
      className="container py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search input */}
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-center">Search</h1>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search products, categories, brands…"
            className="w-full rounded-sm border border-border bg-card py-4 pl-12 pr-4 text-lg outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-forest/50"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" />
          )}
        </div>
      </div>

      {/* Popular */}
      {!query.trim() && !searched && (
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h2 className="eyebrow text-clay">Popular Searches</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="cursor-pointer rounded-sm border border-border px-4 py-2 text-sm transition-colors hover:border-forest/50 hover:text-forest"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="mt-10 space-y-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && searched && total === 0 && (
        <div className="mt-14 text-center">
          <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search term or browse our collections.</p>
        </div>
      )}

      {/* Results */}
      {!loading && results && total > 0 && (
        <div className="mt-10 space-y-12">
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
          </p>

          {/* Categories */}
          {results.categories.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Categories</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {results.categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/categories/${c.slug}`}
                    className="flex items-center gap-3 rounded-sm border border-border bg-card p-3 transition-colors hover:border-forest/40"
                  >
                    {c.image ? (
                      <Image src={c.image} alt={c.name} width={36} height={36} className="h-9 w-9 rounded-sm object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-secondary text-lg font-bold text-muted-foreground">
                        {c.name[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{c.name}</p>
                      {c.productCount > 0 && (
                        <p className="text-xs text-muted-foreground">{c.productCount} items</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Brands */}
          {results.brands.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Brands</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {results.brands.map((b) => (
                  <Link
                    key={b._id}
                    href={`/brands/${b.slug}`}
                    className="flex items-center gap-2.5 rounded-sm border border-border bg-card px-4 py-2.5 transition-colors hover:border-forest/40"
                  >
                    {b.logo ? (
                      <Image src={b.logo} alt={b.name} width={20} height={20} className="h-5 w-5 rounded-sm object-contain" />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-secondary text-[10px] font-bold text-muted-foreground">
                        {b.name[0]}
                      </div>
                    )}
                    <span className="text-sm font-medium">{b.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Products</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
                {results.products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
}
