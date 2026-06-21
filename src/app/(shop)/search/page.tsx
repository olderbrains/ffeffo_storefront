import type { Metadata } from 'next';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search',
};

export default function SearchPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products, categories, brands..."
            className="w-full rounded-lg border bg-background py-4 pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold">Popular Searches</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Sports'].map(
            (term) => (
              <span
                key={term}
                className="cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent"
              >
                {term}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mt-12">
        <p className="text-center text-muted-foreground">
          Start typing to search for products
        </p>
      </div>
    </div>
  );
}
