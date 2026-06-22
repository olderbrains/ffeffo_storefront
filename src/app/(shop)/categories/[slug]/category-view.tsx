'use client';

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

  // Resolve the category (and its sub-categories) from the slug.
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

  // (Re)load page 1 whenever the category or sort changes.
  useEffect(() => {
    if (category) loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortIdx]);

  const hasMore = pagination ? products.length < pagination.total : false;
  const title =
    category?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (status === 'notfound') {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">
          The category you’re looking for doesn’t exist.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {category?.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-6">
          {children.length > 0 && (
            <div>
              <h3 className="font-semibold">Shop by category</h3>
              <ul className="mt-4 space-y-2">
                {children.map((c) => (
                  <li key={c._id}>
                    <Link
                      href={`/categories/${c.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {status === 'ready' && pagination
                ? `${pagination.total} ${pagination.total === 1 ? 'product' : 'products'}`
                : 'Loading…'}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort by:</span>
              <select
                value={sortIdx}
                onChange={(e) => setSortIdx(Number(e.target.value))}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                {SORTS.map((s, i) => (
                  <option key={s.label} value={i}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {status === 'error' && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
              <p className="text-sm text-destructive">Couldn’t load products. Please try again.</p>
              <button
                onClick={() => loadProducts(1, true)}
                className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Retry
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square animate-pulse rounded-lg bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          )}

          {status === 'ready' && products.length === 0 && (
            <div className="rounded-lg border bg-muted/30 p-12 text-center">
              <p className="font-medium">No products in this category yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon — we’re adding new products all the time.
              </p>
            </div>
          )}

          {status === 'ready' && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group space-y-3"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                      {product.brandId && (
                        <p className="text-xs text-muted-foreground">{product.brandId.name}</p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold">
                          ₹{(product.salePrice || product.basePrice).toLocaleString('en-IN')}
                        </span>
                        {product.salePrice && product.salePrice < product.basePrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.basePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {product.ratings.count > 0 && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            ★ {product.ratings.average}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => loadProducts((pagination?.page || 1) + 1, false)}
                    disabled={loadingMore}
                    className="rounded-md border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
