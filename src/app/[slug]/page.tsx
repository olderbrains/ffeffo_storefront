import type { Metadata } from 'next';

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;

  return (
    <div className="container py-8">
      <article className="prose mx-auto max-w-3xl">
        <h1>{slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</h1>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </article>
    </div>
  );
}
