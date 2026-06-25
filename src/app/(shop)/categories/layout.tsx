import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse all collections — considered wardrobes for every kind of trip.',
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
