'use client';

import { Heart, Minus, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { api, ApiError } from '@/lib/api/client';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface Variant {
  _id: string;
  sku: string;
  attributes: { name: string; value: string }[];
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  images: { url: string; alt?: string }[];
  attributes: { name: string; value: string }[];
  variantAttributes: string[];
  variants: Variant[];
  ratings: { average: number; count: number };
  brandId?: { name: string; slug: string };
  categoryId?: { name: string; slug: string };
  tags?: string[];
}

export function ProductView({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'notfound'>('loading');
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [imageIdx, setImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const wished = product ? wishlistIds.includes(product._id) : false;

  useEffect(() => {
    let active = true;
    setStatus('loading');
    (async () => {
      try {
        const data = await api.get<Product>(`/products/${slug}`);
        if (!active) return;
        setProduct(data);
        // default-select the first variant's attribute values
        const first = data.variants?.[0];
        if (first) {
          const init: Record<string, string> = {};
          for (const a of first.attributes) init[a.name] = a.value;
          setSelected(init);
        }
        setStatus('ready');
      } catch (err) {
        if (!active) return;
        setStatus(err instanceof ApiError && err.statusCode === 404 ? 'notfound' : 'error');
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  // distinct option values per variant attribute, in first-seen order
  const optionsByAttr = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (!product) return map;
    for (const attr of product.variantAttributes) {
      const seen: string[] = [];
      for (const v of product.variants) {
        const val = v.attributes.find((a) => a.name === attr)?.value;
        if (val && !seen.includes(val)) seen.push(val);
      }
      map[attr] = seen;
    }
    return map;
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    if (product.variantAttributes.length === 0) return product.variants[0];
    return product.variants.find((v) =>
      product.variantAttributes.every(
        (attr) => v.attributes.find((a) => a.name === attr)?.value === selected[attr],
      ),
    );
  }, [product, selected]);

  if (status === 'loading') {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  if (status === 'error' || !product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-destructive">Couldn’t load this product. Please try again.</p>
      </div>
    );
  }

  const price = selectedVariant?.price ?? product.basePrice;
  const stock = selectedVariant?.stock ?? 0;
  const onSale = !!product.salePrice && product.salePrice < price;
  const displayPrice = onSale ? product.salePrice! : price;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select all options');
      return;
    }
    if (stock <= 0) {
      toast.error('This option is out of stock');
      return;
    }
    addItem(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        variantId: selectedVariant._id,
        sku: selectedVariant.sku,
        variantLabel:
          product.variantAttributes.map((a) => selected[a]).filter(Boolean).join(' / ') ||
          'Default',
        price: displayPrice,
        image: product.images[0]?.url,
        maxStock: stock,
      },
      qty,
    );
    toast.success(`Added ${qty} × ${product.name} to cart`);
  };

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        {product.categoryId && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.categoryId.slug}`} className="hover:text-foreground">
              {product.categoryId.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            {product.images[imageIdx] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[imageIdx].url}
                alt={product.images[imageIdx].alt || product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`aspect-square overflow-hidden rounded-md border ${
                    i === imageIdx ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            {product.brandId && (
              <p className="text-sm font-medium text-muted-foreground">{product.brandId.name}</p>
            )}
            <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
            {product.ratings.count > 0 && (
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {product.ratings.average} ({product.ratings.count} reviews)
              </div>
            )}
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">₹{displayPrice.toLocaleString('en-IN')}</span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground">{product.shortDescription}</p>
          )}

          {/* Variant selectors */}
          {product.variantAttributes.map((attr) => (
            <div key={attr} className="space-y-2 border-t pt-6">
              <p className="text-sm font-medium">
                {attr}: <span className="text-muted-foreground">{selected[attr]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {optionsByAttr[attr]?.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelected((s) => ({ ...s, [attr]: val }))}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                      selected[attr] === val
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Stock + quantity */}
          <div className="flex items-center gap-4 border-t pt-6">
            <div className="flex items-center rounded-md border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-accent"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
                className="px-3 py-2 hover:bg-accent disabled:opacity-40"
                disabled={qty >= stock}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              {stock > 0 ? (stock <= 10 ? `Only ${stock} left` : 'In stock') : 'Out of stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t pt-6">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex-1 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={() => {
                toggleWishlist(product._id);
                toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist');
              }}
              aria-pressed={wished}
              className="flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-red-500 text-red-500' : ''}`} />
              Wishlist
            </button>
          </div>

          {/* Specs */}
          {product.attributes.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold">Specifications</h3>
              <dl className="mt-3 divide-y text-sm">
                {product.attributes.map((a) => (
                  <div key={a.name} className="flex justify-between py-2">
                    <dt className="text-muted-foreground">{a.name}</dt>
                    <dd className="font-medium">{a.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 max-w-3xl border-t pt-8">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
      )}
    </div>
  );
}
