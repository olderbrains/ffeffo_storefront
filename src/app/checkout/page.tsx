import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Address Line 1"
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="State"
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="PIN Code"
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You will be redirected to Razorpay to complete payment securely.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="rounded border px-3 py-1">UPI</span>
              <span className="rounded border px-3 py-1">Debit Card</span>
              <span className="rounded border px-3 py-1">Credit Card</span>
              <span className="rounded border px-3 py-1">Net Banking</span>
              <span className="rounded border px-3 py-1">Wallets</span>
              <span className="rounded border px-3 py-1">EMI</span>
            </div>
          </section>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-16 w-16 shrink-0 animate-pulse rounded-md bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>---</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>---</span>
            </div>
          </div>

          <button className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
