'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Truck, Shield, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  position: number;
}

function HeroSection({ banners }: { banners: Banner[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const activeBanner = banners[0];

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center overflow-hidden -mt-20 pt-20">
      {/* Soft aurora background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]">
          <div
            className="absolute top-[30%] left-[30%] w-[500px] h-[500px] rounded-full opacity-[0.08] animate-aurora"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-[40%] right-[25%] w-[400px] h-[400px] rounded-full opacity-[0.06] animate-aurora"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', animationDelay: '-5s' }}
          />
          <div
            className="absolute bottom-[30%] left-[40%] w-[350px] h-[350px] rounded-full opacity-[0.05] animate-aurora"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', animationDelay: '-10s' }}
          />
        </div>
      </div>

      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(0_0%_99%)_75%)]" />

      <motion.div className="relative z-10 container" style={{ y, opacity }}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/15 bg-violet/5 px-4 py-1.5 text-sm text-violet">
              <Sparkles className="h-3.5 w-3.5" />
              New Collection Available
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground"
            initial={{ opacity: 0, y: 50, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {activeBanner ? (
              <>
                <span className="block">{activeBanner.title}</span>
                {activeBanner.subtitle && (
                  <span className="block mt-2 text-gradient">{activeBanner.subtitle}</span>
                )}
              </>
            ) : (
              <>
                <span className="block">Premium Products,</span>
                <span className="block mt-2 text-gradient">Delivered Fast.</span>
              </>
            )}
          </motion.h1>

          <motion.p
            className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Discover our curated collection of quality products. From everyday
            essentials to premium finds — shop with confidence.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            <Link
              href="/search"
              className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet to-violet-dark px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:shadow-xl hover:shadow-violet/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-light to-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            <Link
              href="/categories"
              className="cursor-pointer flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-8 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:border-black/15 hover:shadow-sm"
            >
              Browse Categories
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="h-6 w-[1px] bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ValueProps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const props = [
    { icon: Truck, label: 'Free Shipping', desc: 'On orders above ₹499' },
    { icon: Shield, label: 'Secure Payments', desc: 'Razorpay powered' },
    { icon: Undo2, label: 'Easy Returns', desc: '7-day return policy' },
    { icon: Star, label: 'Top Quality', desc: 'Curated products only' },
  ];

  return (
    <div ref={ref} className="container py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {props.map((item, i) => (
          <motion.div
            key={item.label}
            className="rounded-2xl border border-black/[0.05] bg-white p-5 flex items-start gap-3 cursor-default shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-violet/10 to-cyan/10 flex items-center justify-center">
              <item.icon className="h-4 w-4 text-violet" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CategoriesSection({ categories, loading }: { categories: Category[]; loading: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="container py-16">
      <motion.div
        className="flex items-end justify-between mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-violet mb-2 block">
            Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/categories"
          className="cursor-pointer hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-secondary animate-pulse" />
            ))
          : categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="cursor-pointer group relative flex aspect-square items-center justify-center rounded-2xl border border-black/[0.05] bg-white p-6 overflow-hidden transition-all duration-500 hover:border-violet/20 hover:shadow-lg hover:shadow-violet/5"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet/[0.03] via-transparent to-cyan/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {cat.image && (
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.image}
                        alt=""
                        className="h-full w-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div className="relative text-center z-10">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-violet">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {cat.productCount} products
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const onSale = product.salePrice && product.salePrice < product.basePrice;
  const displayPrice = onSale ? product.salePrice! : product.basePrice;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="cursor-pointer group block space-y-3"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/[0.05] bg-secondary/50 transition-all duration-500 group-hover:border-violet/15 group-hover:shadow-lg group-hover:shadow-violet/5">
          {product.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Sale badge */}
          {onSale && (
            <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-pink to-violet px-2.5 py-0.5 text-[10px] font-bold text-white">
              SALE
            </div>
          )}

          {/* Quick action hint */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="rounded-xl bg-white/90 backdrop-blur-sm border border-black/[0.05] px-4 py-2 text-center text-xs font-medium text-foreground shadow-sm">
              View Product
            </div>
          </div>
        </div>

        <div className="space-y-1.5 px-1">
          <h3 className="text-sm font-medium line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-violet">
            {product.name}
          </h3>
          {product.brandId && (
            <p className="text-xs text-muted-foreground">{product.brandId.name}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.ratings.count > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground ml-auto">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {product.ratings.average}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedProducts({ products, loading }: { products: Product[]; loading: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="container py-16">
      <motion.div
        className="flex items-end justify-between mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-cyan mb-2 block">
            Curated
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Featured Products
          </h2>
        </div>
        <Link
          href="/search?featured=true"
          className="cursor-pointer hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-secondary animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-secondary animate-pulse" />
              </div>
            ))
          : products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="container py-20">
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-violet/10 bg-gradient-to-br from-violet/[0.04] via-white to-cyan/[0.03] p-12 sm:p-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Aurora inside */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-violet/[0.04] blur-[100px] animate-aurora" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-cyan/[0.04] blur-[100px] animate-aurora" style={{ animationDelay: '-7s' }} />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Join the <span className="text-gradient">Speffo</span> experience
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Sign up today and get early access to new arrivals, exclusive deals, and free shipping on your first order.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="cursor-pointer rounded-2xl bg-gradient-to-r from-violet to-violet-dark px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/20"
            >
              Create Account
            </Link>
            <Link
              href="/search"
              className="cursor-pointer rounded-2xl border border-black/[0.08] bg-white px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-black/15 hover:shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catData, prodData, bannerData] = await Promise.all([
          api.get<{ categories: Category[] }>('/categories?level=0&isActive=true'),
          api.get<{ items: Product[] }>('/products?limit=8&isFeatured=true&sortBy=createdAt&sortOrder=desc'),
          api.get<{ banners: Banner[] }>('/banners?isActive=true&placement=home_hero').catch(() => ({ banners: [] })),
        ]);
        setCategories(catData.categories || []);
        setProducts(prodData.items || []);
        setBanners(bannerData.banners || []);
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
      <div className="noise-overlay" />
      <HeroSection banners={banners} />
      <ValueProps />
      <CategoriesSection categories={categories} loading={loading} />
      <FeaturedProducts products={products} loading={loading} />
      <CTASection />
    </div>
  );
}
