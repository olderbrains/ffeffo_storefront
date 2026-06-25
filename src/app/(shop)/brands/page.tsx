'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api/client';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  productCount: number;
}

function HeroBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[52vh] min-h-[380px] overflow-hidden bg-forest-deep">
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=2000&q=80"
          alt="Our Brands"
          className="h-[120%] w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-forest-deep/20" />
      <motion.div
        className="relative z-10 flex h-full items-end pb-14"
        style={{ opacity }}
      >
        <div className="container">
          <motion.span
            className="eyebrow text-sand/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Curated Partners
          </motion.span>
          <motion.h1
            className="mt-3 font-serif text-5xl font-semibold tracking-tight text-sand sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.4, 0.25, 1] }}
          >
            Our Brands
          </motion.h1>
          <motion.p
            className="mt-4 max-w-lg text-base text-sand/80 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Every brand we carry shares our philosophy — considered design,
            sustainable craft, and pieces built to outlast trends.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

function BrandCard({ brand, index }: { brand: Brand; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 0.4, 0.25, 1] }}
    >
      <Link
        href={`/brands/${brand.slug}`}
        className="group relative block overflow-hidden rounded-sm"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-sand-deep">
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logo.replace('w=200', 'w=800')}
              alt={brand.name}
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-forest/5 to-forest/15">
              <span className="font-serif text-6xl font-bold text-forest/20">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/30 to-transparent"
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.4 }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <motion.div
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 0.4, 0.25, 1] }}
            >
              <h3 className="font-serif text-2xl font-semibold text-sand sm:text-3xl">
                {brand.name}
              </h3>
              {brand.description && (
                <p className="mt-2 text-sm text-sand/70 line-clamp-2">
                  {brand.description}
                </p>
              )}
            </motion.div>

            <motion.div
              className="mt-4 flex items-center gap-2"
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              transition={{ duration: 0.35 }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sand/90">
                Shop {brand.name}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-sand/90" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function BrandMarquee({ brands }: { brands: Brand[] }) {
  if (brands.length < 3) return null;

  return (
    <div className="overflow-hidden border-y border-border bg-sand-deep/40 py-8">
      <div className="flex items-center gap-12 animate-marquee">
        {[...brands, ...brands].map((brand, i) => (
          <Link
            key={`${brand._id}-${i}`}
            href={`/brands/${brand.slug}`}
            className="shrink-0 font-serif text-2xl font-semibold text-foreground/20 transition-colors duration-300 hover:text-forest sm:text-3xl"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ data: Brand[]; pagination: unknown }>('/brands?limit=50&isActive=true');
        setBrands(data.data || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <HeroBanner />
      <BrandMarquee brands={brands} />

      <section className="container py-14 sm:py-20">
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Makers we believe in
          </h2>
          <p className="mt-3 text-muted-foreground">
            We partner with independent labels and heritage ateliers who put craft,
            durability, and environmental responsibility at the heart of everything they make.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl font-semibold">Unable to load brands</p>
            <p className="mt-2 text-muted-foreground">Please check your connection and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {brands.map((brand, i) => (
              <BrandCard key={brand._id} brand={brand} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
