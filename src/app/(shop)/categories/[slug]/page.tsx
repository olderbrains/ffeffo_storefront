import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse products in this category
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-6">
          <div>
            <h3 className="font-semibold">Filters</h3>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Price Range</h3>
            <div className="mt-4 h-8 animate-pulse rounded bg-muted" />
          </div>
          <div>
            <h3 className="font-semibold">Brands</h3>
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing products</p>
            <select className="rounded-md border bg-background px-3 py-2 text-sm">
              <option>Sort by: Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Rating</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
