'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { ProductCard, type CardProduct } from '@/components/product/product-card';
import { api, ApiError } from '@/lib/api/client';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
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
    return () => {
      active = false;
    };
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
        <h1 className="font-serif text-3xl font-semibold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">The category you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-forest hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/70">{title}</span>
      </nav>

      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {category?.description && (
          <p className="mt-3 max-w-2xl text-muted-foreground sm:mx-0">{category.description}</p>
        )}
      </div>

      {/* Subcategory pills */}
      {children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 border-y border-border py-4">
          {children.map((c) => (
            <Link
              key={c._id}
              href={`/categories/${c.slug}`}
              className="rounded-sm border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-foreground/75 transition-colors hover:border-forest/50 hover:text-forest"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {status === 'ready' && pagination
            ? `${pagination.total} ${pagination.total === 1 ? 'style' : 'styles'}`
            : 'Loading…'}
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
          <p className="font-medium">No products in this category yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back soon — we&apos;re adding new styles all the time.
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
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
