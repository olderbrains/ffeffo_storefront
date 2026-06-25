'use client';

import { motion } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { selectCartSubtotal, useCartStore } from '@/lib/stores/cart-store';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: { name: string; contact: string };
  notes: Record<string, string>;
  theme: { color: string };
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface ShippingForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

const EMPTY_FORM: ShippingForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;
const TAX_RATE = 0.18;

const RZP_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = RZP_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const subtotal = useCartStore(selectCartSubtotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const placingRef = useRef(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container py-8" />;

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products before checking out.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const updateField = (field: keyof ShippingForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = (): boolean => {
    if (!form.fullName.trim()) { toast.error('Please enter your full name'); return false; }
    if (!form.phone.trim() || form.phone.trim().length < 10) { toast.error('Please enter a valid phone number'); return false; }
    if (!form.addressLine1.trim()) { toast.error('Please enter your address'); return false; }
    if (!form.city.trim()) { toast.error('Please enter your city'); return false; }
    if (!form.state.trim()) { toast.error('Please enter your state'); return false; }
    if (!form.postalCode.trim() || form.postalCode.trim().length < 6) { toast.error('Please enter a valid PIN code'); return false; }
    return true;
  };

  const handlePay = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!validate()) return;
    if (placingRef.current) return;
    placingRef.current = true;
    setPlacing(true);

    try {
      // 1. Create order in our DB (status: pending)
      const { data: order } = await api.post<{ data: { _id: string; orderNumber: string } }>('/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: 'IN',
        },
        paymentMethod: 'razorpay',
      });

      const orderId: string = (order as unknown as { _id: string })._id;

      // 2. Create Razorpay order on our backend
      const { data: rzpData } = await api.post<{
        data: { razorpayOrderId: string; amount: number; currency: string; keyId: string };
      }>(`/orders/${orderId}/payment/initiate`);

      const { razorpayOrderId, amount, currency, keyId } = rzpData as unknown as {
        razorpayOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      // 3. Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your connection.');
        setPlacing(false);
        placingRef.current = false;
        return;
      }

      // 4. Open Razorpay widget
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: 'Speffo',
        description: `Order #${(order as unknown as { orderNumber: string }).orderNumber}`,
        image: 'https://cdn.assets.speffo.in/brand/logo.png',
        order_id: razorpayOrderId,
        prefill: {
          name: form.fullName.trim(),
          contact: form.phone.trim(),
        },
        notes: { orderId },
        theme: { color: '#1a3c2e' },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled. Your order is saved — you can retry from My Orders.');
            setPlacing(false);
            placingRef.current = false;
            router.push('/account/orders');
          },
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // 5. Verify payment signature on our backend
            await api.post(`/orders/${orderId}/payment/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success('Payment successful! Order confirmed.');
            clearCart();
            router.push('/account/orders');
          } catch {
            toast.error('Payment received but verification failed. Contact support.');
            router.push('/account/orders');
          } finally {
            setPlacing(false);
            placingRef.current = false;
          }
        },
      });

      rzp.open();
    } catch (err) {
      const msg = (err as { message?: string }).message;
      toast.error(msg ?? 'Failed to initiate payment. Please try again.');
      setPlacing(false);
      placingRef.current = false;
    }
  };

  const inputClass =
    'w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-forest focus:ring-1 focus:ring-forest/30 placeholder:text-muted-foreground/60';

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-sm border border-border p-6">
            <h2 className="text-base font-semibold uppercase tracking-[0.08em]">Shipping Address</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input type="text" placeholder="Full Name *" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} className={inputClass} />
              <input type="tel" placeholder="Phone Number *" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} />
              <input type="text" placeholder="Address Line 1 *" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} className={`${inputClass} sm:col-span-2`} />
              <input type="text" placeholder="Address Line 2 (optional)" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} className={`${inputClass} sm:col-span-2`} />
              <input type="text" placeholder="City *" value={form.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} />
              <input type="text" placeholder="State *" value={form.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass} />
              <input type="text" placeholder="PIN Code *" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className={inputClass} />
            </div>
          </section>

          <section className="rounded-sm border border-border p-6">
            <h2 className="text-base font-semibold uppercase tracking-[0.08em]">Payment</h2>
            <div className="mt-4 flex items-start gap-3 rounded-sm border border-forest/20 bg-forest/5 p-4">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} />
              <div>
                <p className="text-sm font-medium text-foreground">Secure Online Payment via Razorpay</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  UPI · Cards · Net Banking · Wallets. 256-bit SSL encrypted.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-sm border border-border p-6 lg:sticky lg:top-28">
          <h2 className="text-base font-semibold uppercase tracking-[0.08em]">Order Summary</h2>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-border bg-secondary">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
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

          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? 'text-forest font-medium' : ''}>
                {shipping === 0 ? 'Free' : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (18% GST)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
              <span>Total</span>
              <span className="text-forest">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={placing}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-forest px-4 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-sand transition-colors hover:bg-forest-deep disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {placing ? 'Processing…' : `Pay ₹${total.toLocaleString('en-IN')}`}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" /> Free over ₹{FREE_SHIPPING_THRESHOLD}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> SSL Secure
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
