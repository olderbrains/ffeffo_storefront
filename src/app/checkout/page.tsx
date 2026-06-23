'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { selectCartSubtotal, useCartStore } from '@/lib/stores/cart-store';

interface ShippingForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pinCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const subtotal = useCartStore(selectCartSubtotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container py-8" />;

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products before checking out.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const updateField = (field: keyof ShippingForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = (): boolean => {
    if (!form.fullName.trim()) { toast.error('Please enter your full name'); return false; }
    if (!form.phone.trim() || form.phone.trim().length < 10) { toast.error('Please enter a valid phone number'); return false; }
    if (!form.addressLine1.trim()) { toast.error('Please enter your address'); return false; }
    if (!form.city.trim()) { toast.error('Please enter your city'); return false; }
    if (!form.state.trim()) { toast.error('Please enter your state'); return false; }
    if (!form.pinCode.trim() || form.pinCode.trim().length < 6) { toast.error('Please enter a valid PIN code'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      router.push('/login');
      return;
    }
    if (!validate()) return;
    if (placing) return;
    setPlacing(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      await api.post('/orders', {
        items: orderItems,
        shippingAddress: form,
        paymentMethod: 'razorpay',
      });

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/account/orders');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

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
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={form.pinCode}
                onChange={(e) => updateField('pinCode', e.target.value)}
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

        <div className="h-fit rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  {item.variantLabel !== 'Default' && (
                    <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {placing ? 'Placing Order…' : 'Place Order & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
