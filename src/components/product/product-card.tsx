'use client';

import { motion, useInView } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { colorHex, colorNeedsBorder } from '@/lib/colors';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

export interface CardProduct {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  images: { url: string; alt?: string; isDefault?: boolean }[];
  ratings?: { average: number; count: number };
  brandId?: { name: string };
  colors?: string[];
}

export function ProductCard({
  product,
  index = 0,
  animate = true,
}: {
  product: CardProduct;
  index?: number;
  animate?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [hover, setHover] = useState(false);

  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const wished = wishlistIds.includes(product._id);

  const onSale = product.salePrice != null && product.salePrice < product.basePrice;
  const displayPrice = onSale ? product.salePrice! : product.basePrice;

  const primary = product.images[0]?.url;
  const secondary = product.images[1]?.url;
  const colors = product.colors ?? [];
  const shownColors = colors.slice(0, 4);
  const extraColors = colors.length - shownColors.length;

  return (
    <motion.div
      ref={ref}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={animate && isInView ? { opacity: 1, y: 0 } : animate ? {} : { opacity: 1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="group"
    >
      <div
        className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
            {primary && (
              <Image
                src={primary}
                alt={product.images[0]?.alt || product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-opacity duration-500 ${
                  hover && secondary ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
            {secondary && (
              <Image
                src={secondary}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-[opacity,transform] duration-[600ms] ease-out ${
                  hover ? 'opacity-100 scale-105' : 'opacity-0'
                }`}
              />
            )}

            {onSale && (
              <span className="absolute left-3 top-3 rounded-sm bg-clay px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-sand">
                Sale
              </span>
            )}
          </div>
        </Link>

        {/* Wishlist */}
        <button
          onClick={() => {
            toggleWishlist(product._id);
            toast.success(wished ? 'Removed from wishlist' : 'Saved to wishlist');
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground/70 backdrop-blur-sm transition-colors hover:text-clay"
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-clay text-clay' : ''}`} strokeWidth={1.7} />
        </button>
      </div>

      <div className="mt-3.5 space-y-1.5">
        {/* Colour swatches */}
        {shownColors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {shownColors.map((c) => (
              <span
                key={c}
                title={c}
                className={`h-3.5 w-3.5 rounded-full ${colorNeedsBorder(c) ? 'ring-1 ring-black/15' : ''}`}
                style={{ backgroundColor: colorHex(c) }}
              />
            ))}
            {extraColors > 0 && (
              <span className="text-[11px] text-muted-foreground">+{extraColors}</span>
            )}
          </div>
        )}

        <Link href={`/products/${product.slug}`} className="block">
          {product.brandId && (
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              {product.brandId.name}
            </p>
          )}
          <h3 className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-clay">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-semibold text-foreground">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
