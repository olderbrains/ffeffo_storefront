import { notFound } from 'next/navigation';

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CmsPageProps) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} | Speffo`,
  };
}

export default async function CmsPage(_props: CmsPageProps) {
  notFound();
}
