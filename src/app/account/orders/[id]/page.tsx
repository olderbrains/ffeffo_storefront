'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';

interface OrderItem {
  productName: string;
  variantName?: string;
  sku: string;
  attributes?: { name: string; value: string }[];
  quantity: number;
  unitPrice: number;
  salePrice: number;
  total: number;
  image?: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
}

interface StatusHistory {
  status: string;
  timestamp: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharge: number;
  total: number;
  statusHistory?: StatusHistory[];
  createdAt: string;
}

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Order>(`/orders/my/${id}`);
        setOrder(data);
      } catch {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="rounded-lg border p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-16 w-16 animate-pulse rounded-md bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/account/orders" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-foreground">
            ← Orders
          </Link>
          <h2 className="mt-1 text-lg font-semibold">Order #{order.orderNumber}</h2>
          <p className="text-xs text-muted-foreground">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            order.status === 'delivered'
              ? 'bg-green-100 text-green-800'
              : order.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {order.status}
        </span>
      </div>

      {order.status !== 'cancelled' && (
        <div className="rounded-lg border p-6">
          <h3 className="font-medium">Order Timeline</h3>
          <div className="mt-4 space-y-4">
            {statusSteps.map((step, i) => {
              const reached = i <= currentStepIdx;
              const historyEntry = order.statusHistory?.find((h) => h.status === step);
              return (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`h-3 w-3 rounded-full ${reached ? 'bg-primary' : 'bg-muted'}`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${reached ? '' : 'text-muted-foreground'}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </p>
                    {historyEntry && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(historyEntry.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg border p-6">
        <h3 className="font-medium">Items</h3>
        <div className="mt-4 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                {item.attributes && item.attributes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {item.attributes.map((a) => a.value).join(' / ')}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">₹{item.total.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="font-medium">Shipping Address</h3>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.addressLine1}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
            </p>
            <p>{order.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-medium">Payment Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shippingCharge ? `₹${order.shippingCharge.toLocaleString('en-IN')}` : 'Free'}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  if (!id) return null;
  return <OrderDetail id={id} />;
}
