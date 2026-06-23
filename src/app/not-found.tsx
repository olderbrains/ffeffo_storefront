import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
      <span className="text-7xl font-bold text-gradient mb-4">404</span>
      <h2 className="text-xl font-bold mb-2">Page not found</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="cursor-pointer rounded-xl bg-gradient-to-r from-violet to-violet-dark px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/25"
      >
        Back to Home
      </Link>
    </div>
  );
}
