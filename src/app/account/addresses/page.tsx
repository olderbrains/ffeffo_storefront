'use client';

import { motion } from 'framer-motion';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  type: string;
  isDefault?: boolean;
}

interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

const EMPTY_FORM: AddressForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};

export default function AddressesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchAddresses();
  }, [isAuthenticated]);

  async function fetchAddresses() {
    try {
      const data = await api.get<{ addresses: Address[] }>('/addresses');
      setAddresses(data.addresses || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof AddressForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (!form.fullName.trim()) { toast.error('Please enter full name'); return; }
    if (!form.phone.trim() || form.phone.trim().length < 10) { toast.error('Please enter a valid phone number'); return; }
    if (!form.addressLine1.trim()) { toast.error('Please enter address'); return; }
    if (!form.city.trim()) { toast.error('Please enter city'); return; }
    if (!form.state.trim()) { toast.error('Please enter state'); return; }
    if (!form.postalCode.trim() || form.postalCode.trim().length < 6) { toast.error('Please enter a valid PIN code'); return; }

    setSaving(true);
    try {
      await api.post('/addresses', {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: 'IN',
        isDefault: addresses.length === 0,
      });

      toast.success('Address saved');
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchAddresses();
    } catch {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(addressId: string) {
    try {
      await api.delete(`/addresses/${addressId}`);
      toast.success('Address removed');
      setAddresses((prev) => prev.filter((a) => a._id !== addressId));
    } catch {
      toast.error('Failed to delete address');
    }
  }

  async function handleSetDefault(addressId: string) {
    try {
      await api.patch(`/addresses/${addressId}/default`, {});
      toast.success('Default address updated');
      await fetchAddresses();
    } catch {
      toast.error('Failed to update default address');
    }
  }

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

  const inputClass =
    'w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-forest focus:ring-1 focus:ring-forest/30 placeholder:text-muted-foreground/60';

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New
          </button>
        )}
      </div>

      {/* Add address form */}
      {showForm && (
        <div className="rounded-lg border p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">New Address</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input type="text" placeholder="Full Name *" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} className={inputClass} />
            <input type="tel" placeholder="Phone Number *" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} />
            <input type="text" placeholder="Address Line 1 *" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} className={`${inputClass} sm:col-span-2`} />
            <input type="text" placeholder="Address Line 2 (optional)" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} className={`${inputClass} sm:col-span-2`} />
            <input type="text" placeholder="City *" value={form.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} />
            <input type="text" placeholder="State *" value={form.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass} />
            <input type="text" placeholder="PIN Code *" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className={inputClass} />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-sm bg-forest px-5 py-2.5 text-sm font-medium text-sand transition-colors hover:bg-forest-deep disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Address'}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="rounded-sm border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-serif text-xl font-semibold">No saved addresses</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a delivery address to speed up checkout.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-forest px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>
      ) : (
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
              <p className="font-medium">{address.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state} — {address.postalCode}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
              <div className="mt-3 flex gap-3">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="flex items-center gap-1 text-xs font-medium text-forest hover:text-forest-deep"
                  >
                    <Star className="h-3 w-3" />
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address._id)}
                  className="flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
