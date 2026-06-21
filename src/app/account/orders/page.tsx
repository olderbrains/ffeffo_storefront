import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
};

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Order History</h2>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="mt-4 flex gap-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-16 w-16 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
