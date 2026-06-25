'use client';

import { Heart, MapPin, Package, Star, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/lib/stores/auth-store';

const accountNav = [
  { name: 'Profile', href: '/account', icon: User },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Reviews', href: '/account/reviews', icon: Star },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-secondary" />
            ))}
          </div>
          <div className="lg:col-span-3">
            <div className="h-64 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">My Account</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside>
          <nav className="space-y-1">
            {accountNav.map((item) => {
              const active = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-forest/10 text-forest'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
