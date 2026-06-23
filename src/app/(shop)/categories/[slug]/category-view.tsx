'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { api, ApiError } from '@/lib/api/client';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const SORTS = [
  { label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Price: Low to High', sortBy: 'basePrice', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'basePrice', sortOrder: 'desc' },
  { label: 'Top Rated', sortBy: 'ratings.average', sortOrder: 'desc' },
  { label: 'Most Popular', sortBy: 'metadata.purchases', sortOrder: 'desc' },
] as const;

const LIMIT = 12;

export function CategoryView({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [children, setChildren] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [sortIdx, setSortIdx] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'notfound'>('loading');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setCategory(null);
    setProducts([]);
    setPagination(null);
    (async () => {
      try {
        const data = await api.get<{ category: Category; children: Category[] }>(
          `/categories/${slug}`,
        );
        if (!active) return;
        setCategory(data.category);
        setChildren(data.children || []);
      } catch (err) {
        if (!active) return;
        setStatus(err instanceof ApiError && err.statusCode === 404 ? 'notfound' : 'error');
      }
    })();
    return () => { active = false; };
  }, [slug]);

  const loadProducts = useCallback(
    async (page: number, replace: boolean) => {
      if (!category) return;
      const sort = SORTS[sortIdx];
      try {
        if (replace) setStatus('loading');
        else setLoadingMore(true);
        const data = await api.get<{ items: Product[]; pagination: Pagination }>(
          `/products?categoryId=${category._id}&status=active&page=${page}&limit=${LIMIT}` +
            `&sortBy=${sort.sortBy}&sortOrder=${sort.sortOrder}`,
        );
        setProducts((prev) => (replace ? data.items : [...prev, ...data.items]));
        setPagination(data.pagination);
        setStatus('ready');
      } catch {
        if (replace) setStatus('error');
      } finally {
        setLoadingMore(false);
      }
    },
    [category, sortIdx],
  );

  useEffect(() => {
    if (category) loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortIdx]);

  const hasMore = pagination ? products.length < pagination.total : false;
  const title = category?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (status === 'notfound') {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">The category you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-violet hover:underline cursor-pointer">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="cursor-pointer hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground/70">{title}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        {category?.description && (
          <p className="mt-2 text-muted-foreground max-w-2xl">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="space-y-6">
          {children.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-3">Subcategories</h3>
              <ul className="space-y-1.5">
                {children.map((c) => (
                  <li key={c._id}>
                    <Link
                      href={`/categories/${c.slug}`}
                      className="cursor-pointer block px-3 py-2 rounded-lg text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-black/[0.03]"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {status === 'ready' && pagination
                ? `${pagination.total} ${pagination.total === 1 ? 'product' : 'products'}`
                : 'Loading…'}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:inline">Sort:</span>
              <select
                value={sortIdx}
                onChange={(e) => setSortIdx(Number(e.target.value))}
                className="cursor-pointer rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet/40"
              >
                {SORTS.map((s, i) => (
                  <option key={s.label} value={i}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {status === 'error' && (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-destructive">Couldn&apos;t load products. Please try again.</p>
              <button
                onClick={() => loadProducts(1, true)}
                className="cursor-pointer mt-4 rounded-xl border border-black/[0.08] px-4 py-2 text-sm font-medium hover:bg-black/[0.03] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-secondary animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-secondary animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {status === 'ready' && products.length === 0 && (
            <div className="glass-card p-12 text-center">
              <p className="font-medium">No products in this category yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon — we&apos;re adding new products all the time.
              </p>
            </div>
          )}

          {status === 'ready' && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3">
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

              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => loadProducts((pagination?.page || 1) + 1, false)}
                    disabled={loadingMore}
                    className="cursor-pointer rounded-xl border border-black/[0.08] px-8 py-3 text-sm font-medium transition-all duration-200 hover:bg-black/[0.03] hover:border-black/15 disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
