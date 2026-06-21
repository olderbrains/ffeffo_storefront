import Link from 'next/link';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/categories' },
    { name: 'New Arrivals', href: '/categories?sort=newest' },
    { name: 'Best Sellers', href: '/categories?sort=popular' },
    { name: 'Brands', href: '/brands' },
  ],
  account: [
    { name: 'My Account', href: '/account' },
    { name: 'Orders', href: '/account/orders' },
    { name: 'Wishlist', href: '/account/wishlist' },
    { name: 'Addresses', href: '/account/addresses' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              Speffo
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Premium products, delivered to your doorstep. Shop with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Speffo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
