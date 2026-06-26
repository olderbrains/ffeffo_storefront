'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Heart, Leaf, Minus, Plus, RotateCcw, Star, Truck, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';

import { colorHex, colorNeedsBorder } from '@/lib/colors';
import { api, ApiError } from '@/lib/api/client';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface Variant {
  _id: string;
  sku: string;
  attributes: { name: string; value: string }[];
  price: number;
  salePrice?: number;
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

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.1em]">{title}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

function Lightbox({ images, startIndex, onClose }: { images: { url: string; alt?: string }[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, next, prev]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute right-5 top-5 z-50 cursor-pointer text-white/80 hover:text-white" aria-label="Close">
        <X className="h-6 w-6" />
      </button>
      <div className="relative h-[85vh] w-[85vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]!.url}
          alt={images[index]!.alt || ''}
          fill
          className="object-contain"
          sizes="85vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`h-2 w-2 cursor-pointer rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'bg-white/40'}`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

export function ProductView({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'notfound'>('loading');
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
    return () => {
      active = false;
    };
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
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-9 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-secondary" />
            <div className="h-32 w-full animate-pulse rounded bg-secondary" />
            <div className="h-14 w-full animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Product not found</h1>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-forest hover:underline">
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
  const onSale = !!product.salePrice && product.salePrice < price;
  const displayPrice = onSale ? product.salePrice! : price;
  const stock = selectedVariant?.stock ?? 0;

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

  const gallery = product.images.length > 0 ? product.images : [{ url: '', alt: product.name }];

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {product.categoryId && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/categories/${product.categoryId.slug}`} className="hover:text-foreground">
              {product.categoryId.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        {/* Gallery — 2-up grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {gallery.map((img, i) => (
            <div
              key={i}
              className={`group/img relative cursor-pointer overflow-hidden rounded-sm bg-secondary ${
                gallery.length === 1 ? 'sm:col-span-2 aspect-[4/3]' : 'aspect-[4/5]'
              }`}
              onClick={() => img.url && setLightboxIndex(i)}
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt={img.alt || product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority={i < 2}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover/img:bg-black/10 group-hover/img:opacity-100">
                <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {lightboxIndex !== null && gallery[0]?.url && (
            <Lightbox
              images={gallery.filter((img) => img.url) as { url: string; alt?: string }[]}
              startIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
        </AnimatePresence>

        {/* Details */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.brandId && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">{product.brandId.name}</p>
          )}
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-end gap-2.5">
              <span className="font-serif text-2xl font-semibold text-forest">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {onSale && (
                <span className="pb-0.5 text-base text-muted-foreground line-through">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.ratings.count > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                {product.ratings.average}
                <span className="text-muted-foreground/60">({product.ratings.count})</span>
              </span>
            )}
          </div>

          {/* Variant selectors */}
          <div className="mt-8 space-y-7">
            {product.variantAttributes.map((attr) => {
              const isColor = attr.toLowerCase() === 'color';
              return (
                <div key={attr}>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                    {attr}: <span className="text-muted-foreground">{selected[attr]}</span>
                  </p>
                  {isColor ? (
                    <div className="flex flex-wrap gap-2.5">
                      {optionsByAttr[attr]?.map((val) => {
                        const active = selected[attr] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => setSelected((s) => ({ ...s, [attr]: val }))}
                            title={val}
                            aria-label={val}
                            aria-pressed={active}
                            className={`relative h-8 w-8 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                              active ? 'ring-2 ring-forest ring-offset-2 ring-offset-background' : ''
                            } ${colorNeedsBorder(val) ? 'ring-1 ring-black/15' : ''}`}
                            style={{ backgroundColor: colorHex(val) }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {optionsByAttr[attr]?.map((val) => {
                        const active = selected[attr] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => setSelected((s) => ({ ...s, [attr]: val }))}
                            aria-pressed={active}
                            className={`min-w-[3rem] cursor-pointer rounded-sm border px-4 py-2.5 text-sm transition-all duration-150 ${
                              active
                                ? 'border-forest bg-forest text-sand'
                                : 'border-border hover:border-forest/50'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quantity */}
          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center rounded-sm border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="cursor-pointer px-3.5 py-3 transition-colors hover:bg-secondary"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
                disabled={qty >= stock}
                className="cursor-pointer px-3.5 py-3 transition-colors hover:bg-secondary disabled:opacity-40"
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
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex-1 cursor-pointer rounded-sm bg-forest px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-forest-deep disabled:opacity-50"
            >
              {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={() => {
                toggleWishlist(product._id);
                toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
              }}
              aria-pressed={wished}
              aria-label="Toggle wishlist"
              className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-sm border border-border transition-colors hover:border-forest/50"
            >
              <Heart className={`h-5 w-5 ${wished ? 'fill-clay text-clay' : ''}`} strokeWidth={1.7} />
            </button>
          </div>

          {/* Trust badges */}
          <ul className="mt-7 space-y-3 border-y border-border py-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.6} />
              Free shipping on orders over ₹1,000
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.6} />
              7-day easy returns &amp; exchanges
            </li>
            <li className="flex items-center gap-3">
              <Leaf className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.6} />
              1% of your order is donated to the planet
            </li>
          </ul>

          {/* Short description */}
          {product.shortDescription && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          )}

          {/* Accordions */}
          <div className="mt-6">
            <Accordion title="Details" defaultOpen>
              <p>{product.description}</p>
            </Accordion>
            {product.attributes.length > 0 && (
              <Accordion title="Fabric & Care">
                <dl className="divide-y divide-border">
                  {product.attributes.map((a) => (
                    <div key={a.name} className="flex justify-between py-2.5">
                      <dt className="text-muted-foreground">{a.name}</dt>
                      <dd className="font-medium text-foreground">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
            )}
            <Accordion title="Shipping & Returns">
              <p>
                Orders ship within 1–2 business days. Enjoy free shipping over ₹1,000 and 7-day
                returns on unworn items with tags attached.
              </p>
            </Accordion>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
