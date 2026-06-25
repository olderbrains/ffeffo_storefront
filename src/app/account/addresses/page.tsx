'use client';

import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';

interface Address {
  _id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function fetchAddresses() {
      try {
        const data = await api.get<{ addresses: Address[] }>('/users/me/addresses');
        setAddresses(data.addresses || []);
      } catch {
        // Endpoint may not exist yet — show empty state gracefully
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">Please log in to manage your addresses.</p>
        </div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-lg border p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-serif text-xl font-semibold">No saved addresses</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a delivery address to speed up checkout.
          </p>
          <button
            onClick={() => toast.info('Address management coming soon')}
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <button
          onClick={() => toast.info('Address management coming soon')}
          className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address, i) => (
          <motion.div
            key={address._id}
            className="relative rounded-lg border p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            {address.isDefault && (
              <span className="absolute right-4 top-4 rounded-sm bg-forest/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest">
                Default
              </span>
            )}
            <p className="font-medium">{address.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {address.line1}
              {address.line2 && `, ${address.line2}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} — {address.pincode}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
