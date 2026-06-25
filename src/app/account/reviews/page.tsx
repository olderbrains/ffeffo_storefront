'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/api/client';

interface Review {
  _id: string;
  productId: string;
  productName: string;
  productImage?: string;
  productSlug: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-muted-foreground/40'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Review[] | { data: Review[] }>('/users/me/reviews');
        const list = Array.isArray(data) ? data : (data as { data: Review[] }).data ?? [];
        setReviews(list);
      } catch {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-sm border border-border bg-secondary" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-sm border border-border p-10 text-center">
        <Star className="mx-auto h-10 w-10 text-muted-foreground/30" strokeWidth={1.2} />
        <h2 className="mt-4 text-base font-semibold">No reviews yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          After you receive your orders, share your experience to help other shoppers.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-sm bg-forest px-5 py-2.5 text-sm font-medium text-sand transition-colors hover:bg-forest-deep"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Your Reviews ({reviews.length})</h2>
      {reviews.map((review) => (
        <div key={review._id} className="flex gap-4 rounded-sm border border-border p-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-border bg-secondary">
            {review.productImage ? (
              <Image src={review.productImage} alt={review.productName} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="h-full w-full bg-secondary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/products/${review.productSlug}`}
              className="text-sm font-medium hover:text-forest hover:underline truncate block"
            >
              {review.productName}
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  review.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : review.status === 'rejected'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {review.status === 'approved' ? 'Published' : review.status === 'rejected' ? 'Rejected' : 'Pending review'}
              </span>
            </div>
            {review.title && (
              <p className="mt-2 text-sm font-medium">{review.title}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{review.body}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
