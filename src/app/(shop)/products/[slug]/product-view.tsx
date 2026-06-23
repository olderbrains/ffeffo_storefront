'use client';

import { motion } from 'framer-motion';
import { Heart, Minus, Plus, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
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
    return () => { active = false; };
  }, [slug]);

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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 w-2/3 rounded-lg bg-secondary animate-pulse" />
            <div className="h-6 w-1/3 rounded-lg bg-secondary animate-pulse" />
            <div className="h-32 w-full rounded-lg bg-secondary animate-pulse" />
            <div className="h-14 w-full rounded-xl bg-secondary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-violet hover:underline cursor-pointer">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  if (status === 'error' || !product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-destructive">Couldn&apos;t load this product. Please try again.</p>
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
          product.variantAttributes.map((a) => selected[a]).filter(Boolean).join(' / ') || 'Default',
        price: displayPrice,
        image: product.images[0]?.url,
        maxStock: stock,
      },
      qty,
    );
    toast.success(`Added ${qty} × ${product.name} to cart`);
  };

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="cursor-pointer hover:text-foreground transition-colors">Home</Link>
        {product.categoryId && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/categories/${product.categoryId.slug}`} className="cursor-pointer hover:text-foreground transition-colors">
              {product.categoryId.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground/70 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div
            className="aspect-square overflow-hidden rounded-2xl border border-black/[0.05] bg-secondary/30"
            layoutId={`product-image-${slug}`}
          >
            {product.images[imageIdx] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[imageIdx].url}
                alt={product.images[imageIdx].alt || product.name}
                className="h-full w-full object-cover"
              />
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`cursor-pointer aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${
                    i === imageIdx
                      ? 'border-violet ring-2 ring-violet/20'
                      : 'border-black/[0.05] hover:border-black/15'
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
              <p className="text-sm font-medium text-violet">{product.brandId.name}</p>
            )}
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.ratings.count > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {product.ratings.average}
                <span className="text-muted-foreground/60">({product.ratings.count} reviews)</span>
              </div>
            )}
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gradient-violet">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Variant selectors */}
          {product.variantAttributes.map((attr) => (
            <div key={attr} className="space-y-3 border-t border-black/[0.04] pt-6">
              <p className="text-sm font-medium">
                {attr}: <span className="text-muted-foreground">{selected[attr]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {optionsByAttr[attr]?.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelected((s) => ({ ...s, [attr]: val }))}
                    className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 ${
                      selected[attr] === val
                        ? 'border-violet bg-violet/5 font-medium text-violet'
                        : 'border-black/[0.08] hover:border-violet/30 hover:bg-violet/[0.02]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4 border-t border-black/[0.04] pt-6">
            <div className="flex items-center rounded-xl border border-black/[0.08] overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="cursor-pointer px-3.5 py-2.5 hover:bg-secondary transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
                className="cursor-pointer px-3.5 py-2.5 hover:bg-secondary transition-colors disabled:opacity-40"
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
          <div className="flex gap-3 border-t border-black/[0.04] pt-6">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="cursor-pointer flex-1 rounded-xl bg-gradient-to-r from-violet to-violet-dark px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/20 disabled:opacity-50 disabled:hover:shadow-none"
            >
              {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={() => {
                toggleWishlist(product._id);
                toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist');
              }}
              aria-pressed={wished}
              className="cursor-pointer flex items-center gap-2 rounded-xl border border-black/[0.08] px-5 py-3.5 text-sm font-medium transition-all duration-200 hover:bg-secondary hover:border-black/15"
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-pink text-pink' : ''}`} />
              Wishlist
            </button>
          </div>

          {/* Specs */}
          {product.attributes.length > 0 && (
            <div className="border-t border-black/[0.04] pt-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <dl className="divide-y divide-black/[0.04] text-sm">
                {product.attributes.map((a) => (
                  <div key={a.name} className="flex justify-between py-2.5">
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
        <div className="mt-16 max-w-3xl border-t border-black/[0.04] pt-10">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
      )}
    </motion.div>
  );
}
