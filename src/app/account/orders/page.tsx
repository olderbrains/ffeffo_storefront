'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';

interface OrderItem {
  productId: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await api.get<{ data: Order[] }>('/orders?limit=20&sortBy=createdAt&sortOrder=desc');
        setOrders(data.data || []);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  if (loading) {
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
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Order History</h2>
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Order History</h2>

      {orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your order history will appear here once you make a purchase.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/account/orders/${order._id}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">
                    ₹{(order.total / 100).toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
