import type { Metadata } from 'next';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id}` };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order #{id}</h2>
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium">Order Timeline</h3>
        <div className="mt-4 space-y-4">
          {['Ordered', 'Confirmed', 'Shipped', 'Delivered'].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-muted" />
              <div className="flex-1">
                <p className="text-sm font-medium">{step}</p>
                <p className="text-xs text-muted-foreground">
                  {i === 0 ? 'Pending' : '---'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium">Items</h3>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 w-16 animate-pulse rounded-md bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
