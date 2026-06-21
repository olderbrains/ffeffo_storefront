import Link from 'next/link';
import { Heart, MapPin, Package, Star, User } from 'lucide-react';

const accountNav = [
  { name: 'Profile', href: '/account', icon: User },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Reviews', href: '/account/reviews', icon: Star },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">My Account</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside>
          <nav className="space-y-1">
            {accountNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
