import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <h1 className="mt-2 text-3xl font-bold">
              {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold">---</div>
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-10 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>

          <div className="flex gap-4 border-t pt-6">
            <button className="flex-1 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Add to Cart
            </button>
            <button className="rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent">
              Wishlist
            </button>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h2 className="font-semibold">Description</h2>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
