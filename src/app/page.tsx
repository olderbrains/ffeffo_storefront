'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api/client';
import { ProductCard, type CardProduct } from '@/components/product/product-card';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
}

type Product = CardProduct;

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: { desktop: string; mobile: string };
  link?: string;
  position: string;
  priority: number;
}

/* ------------------------------------------------------------------ */
/* Hero — full-bleed editorial image with overlaid headline           */
/* ------------------------------------------------------------------ */
function HeroSection({ banners }: { banners: Banner[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.42, 0.7]);

  const banner = banners[0];
  const title = banner?.title ?? 'Designed for Detours';
  const subtitle =
    banner?.subtitle ??
    'Considered, durable goods for every kind of trip — from the weekend watering hole to exploring a new city.';
  const heroImage =
    banner?.image?.desktop ??
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80';
  const ctaHref = banner?.link ?? '/search?sort=newest';

  return (
    <section ref={ref} className="relative h-[88vh] min-h-[560px] overflow-hidden bg-forest-deep">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={title}
          className="h-[118%] w-full object-cover"
        />
      </motion.div>

      {/* Tinted gradient overlay for legibility */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-forest-deep/40"
        style={{ opacity: overlay }}
      />

      <div className="relative z-10 flex h-full items-end pb-16 sm:items-center sm:pb-0">
        <div className="container">
          <div className="max-w-2xl">
            <motion.span
              className="eyebrow text-sand/80"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              The New Arrivals
            </motion.span>

            <motion.h1
              className="mt-4 font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-sand sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 0.4, 0.25, 1] }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-md text-base leading-relaxed text-sand/85 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Link
                href={ctaHref}
                className="group inline-flex items-center justify-center gap-2 rounded-sm bg-sand px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-forest-deep transition-all duration-300 hover:bg-white"
              >
                Shop New Arrivals
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-sand/40 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-sand transition-all duration-300 hover:border-sand hover:bg-sand/10"
              >
                Explore Collections
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-sand/70">Scroll</span>
          <div className="h-7 w-px bg-gradient-to-b from-sand/60 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Values strip                                                        */
/* ------------------------------------------------------------------ */
function ValueStrip() {
  const props = [
    { icon: Leaf, label: 'Made Responsibly', desc: 'Sustainable materials, fair factories' },
    { icon: Truck, label: 'Free Shipping', desc: 'On every order over ₹1,000' },
    { icon: RotateCcw, label: '7-Day Returns', desc: 'Easy, no-fuss exchanges' },
    { icon: ShieldCheck, label: 'Secure Checkout', desc: 'Razorpay-protected payments' },
  ];

  return (
    <div className="border-y border-border bg-sand-deep/40">
      <div className="container">
        <div className="grid grid-cols-2 divide-x divide-border/70 lg:grid-cols-4">
          {props.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-6 ${i >= 2 ? 'border-t border-border/70 lg:border-t-0' : ''}`}
            >
              <item.icon className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.6} />
              <div>
                <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial split — brand story                                       */
/* ------------------------------------------------------------------ */
function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="container py-20 sm:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 0.4, 0.25, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80"
            alt="Considered design, built to last"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span className="eyebrow text-clay">Our Promise</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            A brand with stories to tell, built for the long way round.
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
            Every piece is designed to be lived in — versatile, durable, and made
            with materials that tread lightly. We believe good things should last,
            and the best journeys rarely follow a straight line.
          </p>
          <Link
            href="/about"
            className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-forest"
          >
            Read our story
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Categories — photographic grid                                      */
/* ------------------------------------------------------------------ */
function CategoriesSection({ categories, loading }: { categories: Category[]; loading: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="container py-16 sm:py-20">
      <motion.div
        className="mb-10 flex items-end justify-between"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="eyebrow text-clay">Collections</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/categories"
          className="link-underline hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-colors hover:text-foreground sm:flex"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-secondary" />
            ))
          : categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.07 }}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-forest-deep"
                >
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-forest to-forest-deep" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="font-serif text-lg font-semibold text-sand sm:text-xl">
                      {cat.name}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-sand/80">
                      Shop now <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial 2-up banners                                              */
/* ------------------------------------------------------------------ */
function EditorialBanners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const tiles = [
    {
      eyebrow: 'The Edit',
      title: 'The Summer Edit',
      cta: 'Shop the Edit',
      href: '/categories/womens',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      eyebrow: "Women's Pants",
      title: 'Work-to-Weekend Wide Legs',
      cta: "Shop Women's Pants",
      href: '/categories/womens-bottoms',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <section ref={ref} className="container py-6 sm:py-10">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {tiles.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <Link
              href={t.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-forest-deep sm:aspect-[16/13]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="eyebrow text-sand/80">{t.eyebrow}</span>
                <h3 className="mt-2 max-w-xs font-serif text-2xl font-semibold leading-tight text-sand sm:text-3xl">
                  {t.title}
                </h3>
                <span className="mt-4 inline-block rounded-sm border border-sand/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand transition-colors group-hover:bg-sand group-hover:text-forest-deep">
                  {t.cta}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured products                                                   */
/* ------------------------------------------------------------------ */
function FeaturedProducts({ products, loading }: { products: Product[]; loading: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="border-t border-border bg-sand-deep/30">
      <div className="container py-16 sm:py-20">
        <motion.div
          className="mb-10 flex items-end justify-between"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="eyebrow text-clay">Bestsellers</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Loved by Wanderers
            </h2>
          </div>
          <Link
            href="/search?featured=true"
            className="link-underline hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-foreground/70 transition-colors hover:text-foreground sm:flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
                </div>
              ))
            : products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter CTA                                                      */
/* ------------------------------------------------------------------ */
function NewsletterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section ref={ref} className="relative overflow-hidden bg-forest-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-forest-deep/70" />
      <motion.div
        className="container relative z-10 py-20 text-center sm:py-28"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="eyebrow text-sand/70">Join the Detour</span>
        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight text-sand sm:text-5xl">
          Stories, early access &amp; a little inspiration.
        </h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-sand/80">
          Sign up for new arrivals, members-only offers, and ₹500 off your first order.
        </p>

        {done ? (
          <p className="mt-9 text-sand">Thanks — keep an eye on your inbox. ✦</p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.trim()) return;
              try {
                await api.post('/newsletter/subscribe', { email: email.trim() });
                setDone(true);
              } catch {
                setDone(true);
              }
            }}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-sm border border-sand/30 bg-sand/10 px-5 py-3.5 text-sm text-sand placeholder:text-sand/50 outline-none transition-colors focus:border-sand"
            />
            <button
              type="submit"
              className="rounded-sm bg-sand px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-forest-deep transition-colors hover:bg-white"
            >
              Sign Up
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [catData, prodData, bannerData] = await Promise.all([
          api.get<{ categories: Category[] }>('/categories?level=0&isActive=true'),
          api.get<{ items: Product[] }>('/products?limit=8&isFeatured=true&sortBy=createdAt&sortOrder=desc'),
          api.get<{ data: Banner[]; pagination: unknown }>('/banners?position=hero').catch(() => ({ data: [], pagination: null })),
        ]);
        setCategories(catData.categories || []);
        setProducts(prodData.items || []);
        setBanners(bannerData.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="noise-overlay" />
      {error && !loading && (
        <div className="container py-20 text-center">
          <div className="mx-auto max-w-md">
            <p className="font-serif text-2xl font-semibold text-foreground">Something went wrong</p>
            <p className="mt-2 text-muted-foreground">We couldn&apos;t load the page content. Please try again.</p>
            <button
              onClick={() => { setError(false); setLoading(true); window.location.reload(); }}
              className="mt-6 rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <HeroSection banners={banners} />
      <ValueStrip />
      <FeaturedProducts products={products} loading={loading} />
      <EditorialBanners />
      <CategoriesSection categories={categories} loading={loading} />
      <StorySection />
      <NewsletterSection />
    </div>
  );
}
