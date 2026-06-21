'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
        return 'Sign-up was cancelled.';
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
      router.replace('/account');
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join Speffo and start shopping</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign up with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
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
                className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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
              autoComplete="new-password"
              required
              minLength={6}
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
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
