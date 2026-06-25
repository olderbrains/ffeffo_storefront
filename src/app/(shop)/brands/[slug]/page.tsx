import type { Metadata } from 'next';

import { BrandView } from './brand-view';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} — Shop the Collection`,
    description: `Explore ${title} on Speffo — considered design, sustainable craft.`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  return <BrandView slug={slug} />;
}
