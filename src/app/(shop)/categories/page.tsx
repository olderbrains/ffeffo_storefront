'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api/client';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  level?: number;
  parentId?: string | null;
  children?: Category[];
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
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
          alt="Collections"
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
            Browse
          </motion.span>
          <motion.h1
            className="mt-3 font-serif text-5xl font-semibold tracking-tight text-sand sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.4, 0.25, 1] }}
          >
            Collections
          </motion.h1>
          <motion.p
            className="mt-4 max-w-lg text-base text-sand/80 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Considered wardrobes for every kind of trip. Explore by world.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isLarge = index < 2;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 0.4, 0.25, 1] }}
      className={isLarge ? 'md:col-span-2' : ''}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="group relative block overflow-hidden rounded-xl bg-forest-deep"
      >
        <div className={`relative ${isLarge ? 'aspect-[16/9]' : 'aspect-[3/4]'}`}>
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-forest to-forest-deep" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent transition-opacity duration-500 group-hover:from-forest-deep/90" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <div className="overflow-hidden">
              <motion.div
                className="translate-y-0 transition-transform duration-500 group-hover:-translate-y-1"
              >
                <span className="eyebrow text-sand/60">
                  {category.productCount || 0} styles
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-sand sm:text-3xl">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 max-w-sm text-sm text-sand/70 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sand/80 transition-colors duration-300 group-hover:text-sand">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                Explore
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SubcategoryRow({ parent }: { parent: Category }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  if (!parent.children || parent.children.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      className="mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
        <div>
          <span className="eyebrow text-clay">{parent.name}</span>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Shop {parent.name}
          </h2>
        </div>
        <Link
          href={`/categories/${parent.slug}`}
          className="link-underline flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground/60 hover:text-foreground"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:gap-4">
        {parent.children.map((child, i) => (
          <motion.div
            key={child._id}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="shrink-0"
          >
            <Link
              href={`/categories/${child.slug}`}
              className="group relative block w-44 overflow-hidden rounded-xl sm:w-52"
            >
              <div className="aspect-[4/5] bg-secondary">
                {child.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={child.image}
                    alt={child.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand-deep to-sand">
                    <span className="font-serif text-3xl font-semibold text-forest/30">
                      {child.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-medium text-foreground transition-colors group-hover:text-clay">
                  {child.name}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ categories: Category[] }>('/categories?isActive=true');
        const all = data.categories || [];
        const parents = all.filter((c) => c.level === 0 || !c.parentId);
        const children = all.filter((c) => c.level === 1 || c.parentId);
        const tree = parents.map((p) => ({
          ...p,
          children: children.filter((c) => c.parentId === p._id),
        }));
        setCategories(tree);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const topLevel = categories;

  return (
    <div>
      <HeroBanner />

      <section className="container py-14 sm:py-20">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-xl bg-secondary ${i < 2 ? 'aspect-[16/9] md:col-span-2' : 'aspect-[3/4]'}`}
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl font-semibold">Unable to load collections</p>
            <p className="mt-2 text-muted-foreground">Please check your connection and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {topLevel.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>

            {categories
              .filter((c) => c.children && c.children.length > 0)
              .map((parent) => (
                <SubcategoryRow key={parent._id} parent={parent} />
              ))}
          </>
        )}
      </section>
    </div>
  );
}
