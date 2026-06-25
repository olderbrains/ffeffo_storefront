import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Explore our curated collection of independent labels and heritage makers — sustainable craft, considered design.',
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
