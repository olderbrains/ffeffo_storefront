import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

export default function CartPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-lg border p-4"
              >
                <div className="h-24 w-24 shrink-0 animate-pulse rounded-md bg-muted" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>---</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>---</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span>---</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>---</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                Apply
              </button>
            </div>
            <Link
              href="/checkout"
              className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
