import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'index, follow',
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">{children}</div>
    </div>
  );
}
