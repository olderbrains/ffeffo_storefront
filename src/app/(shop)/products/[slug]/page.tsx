import type { Metadata } from 'next';

import { ProductView } from './product-view';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return { title, description: `Shop ${title} at Speffo.` };
  }

  const title = product.seo?.title || product.name;
  const description = product.seo?.description || product.shortDescription || product.description?.slice(0, 160);
  const image = product.images?.[0]?.url;

  return {
    title,
    description,
    keywords: product.seo?.keywords,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
