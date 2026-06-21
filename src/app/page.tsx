'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { api } from '@/lib/api/client';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  images: { url: string; alt?: string; isDefault: boolean }[];
  ratings: { average: number; count: number };
  brandId?: { name: string };
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catData, prodData] = await Promise.all([
          api.get<{ categories: Category[] }>('/categories?level=0&isActive=true'),
          api.get<{ items: Product[] }>('/products?limit=8&isFeatured=true&sortBy=createdAt&sortOrder=desc'),
        ]);
        setCategories(catData.categories || []);
        setProducts(prodData.items || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Premium Products,
              <br />
              <span className="text-primary">Delivered Fast</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Discover our curated collection of quality products. From everyday
              essentials to premium finds — shop with confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/categories/electronics"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/search?featured=true"
                className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Featured Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
                ))
              : categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/categories/${cat.slug}`}
                    className="group relative flex aspect-square items-center justify-center rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">{cat.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{cat.productCount} products</p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <Link href="/search?featured=true" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square animate-pulse rounded-lg bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                ))
              : products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group space-y-3"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                      {product.images[0] && (
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
                        {product.ratings.count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ★ {product.ratings.average}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
