'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = {
  Shop: [
    { name: 'New Arrivals', href: '/search?sort=newest' },
    { name: 'All Collections', href: '/categories' },
    { name: 'Bestsellers', href: '/search?featured=true' },
    { name: 'Sale', href: '/search?sale=true' },
    { name: 'Brands', href: '/brands' },
  ],
  Account: [
    { name: 'My Account', href: '/account' },
    { name: 'Orders', href: '/account/orders' },
    { name: 'Wishlist', href: '/account/wishlist' },
    { name: 'Addresses', href: '/account/addresses' },
  ],
  Help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping-policy' },
    { name: 'Returns', href: '/return-policy' },
    { name: 'Privacy', href: '/privacy-policy' },
    { name: 'Terms', href: '/terms' },
  ],
};

const socials = [
  { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
  { label: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-forest-deep text-sand">
      <div className="container py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="cursor-pointer inline-block">
              <Image
                src="/logo.png"
                alt="Speffo"
                width={100}
                height={36}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-sand/70">
              Considered, durable goods designed for detours. Made responsibly,
              built to be lived in — since &rsquo;96.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-sand/20 text-sand/80 transition-colors hover:border-sand/50 hover:text-sand"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="eyebrow mb-4 text-sand/60">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="link-underline cursor-pointer text-sm text-sand/80 transition-colors hover:text-sand"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sand/15 pt-8 sm:flex-row">
          <p className="text-xs text-sand/60">
            &copy; {new Date().getFullYear()} Speffo. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-sand/50">
            Designed for Detours
          </p>
        </div>
      </div>
    </footer>
  );
}
