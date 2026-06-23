'use client';

import { motion } from 'framer-motion';
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
          className="cursor-pointer mt-6 inline-block rounded-xl bg-gradient-to-r from-violet to-violet-dark px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/25"
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

  const inputClass = "w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-violet/40 focus:ring-2 focus:ring-violet/20 placeholder:text-muted-foreground/60";

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-5">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input type="text" placeholder="Full Name" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} className={inputClass} />
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} />
              <input type="text" placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} className={`${inputClass} sm:col-span-2`} />
              <input type="text" placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} />
              <input type="text" placeholder="State" value={form.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass} />
              <input type="text" placeholder="PIN Code" value={form.pinCode} onChange={(e) => updateField('pinCode', e.target.value)} className={inputClass} />
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <p className="text-sm text-muted-foreground mb-4">
              You will be redirected to Razorpay to complete payment securely.
            </p>
            <div className="flex flex-wrap gap-2">
              {['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallets', 'EMI'].map((m) => (
                <span key={m} className="rounded-lg border border-black/[0.08] bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground">{m}</span>
              ))}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="h-fit glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/[0.05] bg-secondary/30">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {item.variantLabel !== 'Default' && (
                    <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-black/[0.04] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-cyan">Free</span>
            </div>
            <div className="flex justify-between border-t border-black/[0.04] pt-2 font-semibold">
              <span>Total</span>
              <span className="text-gradient-violet">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="cursor-pointer mt-6 w-full rounded-xl bg-gradient-to-r from-violet to-violet-dark px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/25 disabled:opacity-50"
          >
            {placing ? 'Placing Order…' : 'Place Order & Pay'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
