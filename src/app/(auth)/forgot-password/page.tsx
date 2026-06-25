'use client';

import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { auth } from '@/lib/firebase';

function describeError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code);
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
        return 'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local.';
      default:
        break;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return 'Unable to send reset link. Please try again.';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !email.trim()) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet/[0.04] blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan/[0.03] blur-[120px]" />
      </div>

      <motion.div
        className="relative w-full max-w-md glass-card p-8 sm:p-10"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
      >
        {sent ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest/10">
              <CheckCircle2 className="h-7 w-7 text-forest" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Check Your Inbox</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-foreground">{email}</span>.
              Follow the instructions in the email to reset your password.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest-deep"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet/20 to-cyan/20 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet to-cyan opacity-80 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">S</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold">Reset Your Password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a link to reset your password
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-violet/40 focus:ring-2 focus:ring-violet/20 placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full rounded-xl bg-gradient-to-r from-violet to-violet-dark px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
