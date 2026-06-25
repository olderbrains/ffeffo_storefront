'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { loginWithGoogle, registerWithEmail } from '@/lib/api/auth';

function describeError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code);
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
        return 'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Sign-up was cancelled.';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site and try again.';
      default:
        break;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return 'Unable to create account. Please try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await registerWithEmail({ firstName, lastName, email, password });
      toast.success('Account created successfully');
      router.replace(redirect);
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Account ready');
      router.replace(redirect);
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <motion.div
        className="relative w-full max-w-md glass-card p-8 sm:p-10"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logo.png"
              alt="Speffo"
              width={120}
              height={44}
              className="h-10 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join Speffo and start shopping</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:bg-black/[0.03] hover:border-black/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">Or</span>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-forest/40 focus:ring-2 focus:ring-forest/20 placeholder:text-muted-foreground/60"
              />
              <input
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-forest/40 focus:ring-2 focus:ring-forest/20 placeholder:text-muted-foreground/60"
              />
            </div>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-forest/40 focus:ring-2 focus:ring-forest/20 placeholder:text-muted-foreground/60"
            />
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-forest/40 focus:ring-2 focus:ring-forest/20 placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full rounded-xl bg-forest px-4 py-3.5 text-sm font-medium text-sand transition-all duration-200 hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={`/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="cursor-pointer font-medium text-forest hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
