'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { devLogin, loginWithEmail, loginWithGoogle } from '@/lib/api/auth';

const IS_DEV = process.env.NODE_ENV === 'development';

function describeError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code);
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
        return 'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      default:
        break;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return 'Unable to sign in. Please try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Signed in successfully');
      router.replace('/account');
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in successfully');
      router.replace('/account');
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await devLogin('vikas.kumar@gmail.com');
      toast.success('Signed in as vikas.kumar@gmail.com');
      router.replace('/account');
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue shopping
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleEmailLogin}>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {IS_DEV && (
          <button
            type="button"
            onClick={handleDevLogin}
            disabled={loading}
            className="w-full rounded-md border border-dashed border-amber-500/50 bg-amber-500/5 px-4 py-2 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/10 disabled:opacity-60 dark:text-amber-400"
          >
            Dev login (local only — as vikas.kumar@gmail.com)
          </button>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-foreground">
            Forgot password?
          </Link>
          <span className="mx-2">|</span>
          <Link href="/register" className="hover:text-foreground">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
