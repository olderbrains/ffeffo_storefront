'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const footerLinks = {
  Shop: [
    { name: 'All Products', href: '/categories' },
    { name: 'New Arrivals', href: '/categories?sort=newest' },
    { name: 'Best Sellers', href: '/categories?sort=popular' },
    { name: 'Brands', href: '/brands' },
  ],
  Account: [
    { name: 'My Account', href: '/account' },
    { name: 'Orders', href: '/account/orders' },
    { name: 'Wishlist', href: '/account/wishlist' },
    { name: 'Addresses', href: '/account/addresses' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-black/[0.04] bg-secondary/30">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />

      <div className="container relative py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet to-cyan opacity-90" />
                <div className="absolute inset-[2px] rounded-[6px] bg-white flex items-center justify-center">
                  <span className="text-sm font-bold text-gradient">S</span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight">Speffo</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              Premium products, delivered to your doorstep. The modern shopping experience you deserve.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-black/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Speffo. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
              { label: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' },
            ].map((social) => (
              <motion.a
                key={social.label}
                href="#"
                className="cursor-pointer h-8 w-8 rounded-lg border border-black/[0.06] bg-white flex items-center justify-center text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-black/10 hover:shadow-sm"
                whileHover={{ y: -2 }}
                aria-label={social.label}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.path} />
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
