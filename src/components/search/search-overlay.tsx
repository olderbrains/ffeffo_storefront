'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Grid3X3, Package, Search, Tag, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ProductHit {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  basePrice: number;
  salePrice?: number;
  brand?: { name: string; slug: string };
  category?: { name: string; slug: string };
}

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
  products: ProductHit[];
  categories: CategoryHit[];
  brands: BrandHit[];
  total: number;
}

const POPULAR = ['Tee', 'Linen', 'Perfume', 'Pant', 'Dress', 'Jacket', 'Tote', 'Sale'];

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q.trim())}&limit=6`);
      const json = await res.json();
      setResults(json.data as SearchResults);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults(null); setActiveIndex(-1); return; }
    debounceRef.current = setTimeout(() => doSearch(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery('');
      setResults(null);
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const goToFullSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') goToFullSearch();
  };

  const total = results ? results.products.length + results.categories.length + results.brands.length : 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed left-0 right-0 top-0 z-[61] bg-background shadow-2xl"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Search input row */}
            <div className="container flex items-center gap-4 py-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.6} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, categories, brands…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
              />
              {loading && (
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-forest border-t-transparent" />
              )}
              {query && !loading && (
                <button
                  onClick={() => { setQuery(''); setResults(null); inputRef.current?.focus(); }}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="ml-2 shrink-0 rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:border-forest/40 hover:text-foreground transition-colors"
              >
                Esc
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Results / popular */}
            <div className="container pb-6">
              {!query.trim() && (
                <div className="pt-5">
                  <p className="eyebrow mb-3 text-clay">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="cursor-pointer rounded-sm border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-forest/50 hover:text-forest"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && !loading && results && total === 0 && (
                <p className="pt-8 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}

              {results && total > 0 && (
                <div className="grid gap-6 pt-5 sm:grid-cols-[1fr_auto]">
                  {/* Products */}
                  {results.products.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        <Package className="h-3 w-3" />
                        Products
                      </div>
                      <div className="space-y-1">
                        {results.products.map((p, i) => (
                          <button
                            key={p._id}
                            onClick={() => { router.push(`/products/${p.slug}`); onClose(); }}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-secondary',
                              activeIndex === i && 'bg-secondary',
                            )}
                          >
                            <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-secondary">
                              {p.image ? (
                                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{p.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {p.brand?.name && <span>{p.brand.name} · </span>}
                                {p.salePrice ? (
                                  <>
                                    <span className="text-clay font-medium">{formatPrice(p.salePrice)}</span>
                                    <span className="ml-1 line-through opacity-50">{formatPrice(p.basePrice)}</span>
                                  </>
                                ) : (
                                  <span>{formatPrice(p.basePrice)}</span>
                                )}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories + Brands sidebar */}
                  <div className="min-w-[200px] space-y-5">
                    {results.categories.length > 0 && (
                      <div>
                        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                          <Grid3X3 className="h-3 w-3" />
                          Categories
                        </div>
                        <div className="space-y-0.5">
                          {results.categories.map((c) => (
                            <button
                              key={c._id}
                              onClick={() => { router.push(`/categories/${c.slug}`); onClose(); }}
                              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
                            >
                              <span className="truncate">{c.name}</span>
                              {c.productCount > 0 && (
                                <span className="ml-2 shrink-0 text-xs text-muted-foreground">{c.productCount}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.brands.length > 0 && (
                      <div>
                        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                          <Tag className="h-3 w-3" />
                          Brands
                        </div>
                        <div className="space-y-0.5">
                          {results.brands.map((b) => (
                            <button
                              key={b._id}
                              onClick={() => { router.push(`/brands/${b.slug}`); onClose(); }}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
                            >
                              {b.logo ? (
                                <Image src={b.logo} alt={b.name} width={20} height={20} className="h-5 w-5 rounded-sm object-contain" />
                              ) : (
                                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-secondary text-[10px] font-bold text-muted-foreground">
                                  {b.name[0]}
                                </div>
                              )}
                              <span className="truncate">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View all results */}
              {query.trim() && total > 0 && (
                <button
                  onClick={goToFullSearch}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border border-forest/30 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-sand"
                >
                  View all results for &ldquo;{query}&rdquo;
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
