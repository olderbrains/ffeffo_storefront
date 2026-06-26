'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { ProductCard, type CardProduct } from '@/components/product/product-card';
import { api, ApiError } from '@/lib/api/client';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}

type Product = CardProduct;

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

export function BrandView({ slug }: { slug: string }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [sortIdx, setSortIdx] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'notfound'>('loading');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setBrand(null);
    setProducts([]);
    (async () => {
      try {
        const data = await api.get<Brand>(`/brands/${slug}`);
        if (!active) return;
        setBrand(data);
      } catch (err) {
        if (!active) return;
        setStatus(err instanceof ApiError && err.statusCode === 404 ? 'notfound' : 'error');
      }
    })();
    return () => { active = false; };
  }, [slug]);

  const loadProducts = useCallback(
    async (page: number, replace: boolean) => {
      if (!brand) return;
      const sort = SORTS[sortIdx];
      try {
        if (replace) setStatus('loading');
        else setLoadingMore(true);
        const data = await api.get<{ items: Product[]; pagination: Pagination }>(
          `/products?brandId=${brand._id}&status=active&page=${page}&limit=${LIMIT}` +
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
    [brand, sortIdx],
  );

  useEffect(() => {
    if (brand) loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, sortIdx]);

  const hasMore = pagination ? products.length < pagination.total : false;
  const title = brand?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (status === 'notfound') {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Brand not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn&apos;t find the brand you&apos;re looking for.</p>
        <Link href="/brands" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to brands
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Brand hero */}
      <section className="relative overflow-hidden bg-forest-deep">
        {brand?.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logo.replace('w=200', 'w=1600')}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/70 to-forest-deep/50" />
        <div className="container relative z-10 py-16 sm:py-24">
          <motion.nav
            className="mb-6 flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-sand/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="hover:text-sand">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/brands" className="hover:text-sand">Brands</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-sand/80">{title}</span>
          </motion.nav>

          <motion.h1
            className="font-serif text-4xl font-semibold tracking-tight text-sand sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          {brand?.description && (
            <motion.p
              className="mt-4 max-w-xl text-base text-sand/75 sm:text-lg"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {brand.description}
            </motion.p>
          )}
        </div>
      </section>

      {/* Product grid */}
      <motion.div
        className="container py-10 sm:py-14"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {status === 'ready' && pagination
              ? `${pagination.total} ${pagination.total === 1 ? 'style' : 'styles'}`
              : 'Loading...'}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden uppercase tracking-[0.08em] text-muted-foreground sm:inline">Sort</span>
            <select
              value={sortIdx}
              onChange={(e) => setSortIdx(Number(e.target.value))}
              className="cursor-pointer rounded-sm border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-forest/50"
            >
              {SORTS.map((s, i) => (
                <option key={s.label} value={i}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        {status === 'error' && (
          <div className="rounded-sm border border-border p-8 text-center">
            <p className="text-sm text-destructive">Couldn&apos;t load products. Please try again.</p>
            <button
              onClick={() => loadProducts(1, true)}
              className="mt-4 cursor-pointer rounded-sm border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Retry
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] animate-pulse rounded-xl bg-secondary" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        )}

        {status === 'ready' && products.length === 0 && (
          <div className="rounded-sm border border-border p-12 text-center">
            <p className="font-medium">No products from this brand yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon — new styles are on their way.
            </p>
          </div>
        )}

        {status === 'ready' && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => loadProducts((pagination?.page || 1) + 1, false)}
                  disabled={loadingMore}
                  className="cursor-pointer rounded-sm border border-forest px-10 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-forest transition-colors hover:bg-forest hover:text-sand disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
