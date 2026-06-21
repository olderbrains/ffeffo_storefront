import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/auth-store';

import { api } from './client';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface AuthResponse {
  user: AuthUser;
  tokens: Tokens;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await credential.user.getIdToken();
  const { user, tokens } = await api.post<AuthResponse>('/auth/login', { firebaseToken });
  useAuthStore.getState().setAuth(user, tokens);
  return user;
}

export async function loginWithGoogle(): Promise<AuthUser> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const firebaseToken = await credential.user.getIdToken();
  const displayName = credential.user.displayName ?? '';
  const [first, ...rest] = displayName.split(' ');

  // Try login first; fall back to registration for first-time Google users.
  try {
    const { user, tokens } = await api.post<AuthResponse>('/auth/login', { firebaseToken });
    useAuthStore.getState().setAuth(user, tokens);
    return user;
  } catch {
    const { user, tokens } = await api.post<AuthResponse>('/auth/register', {
      firebaseToken,
      firstName: first || 'Customer',
      lastName: rest.join(' ') || 'User',
    });
    useAuthStore.getState().setAuth(user, tokens);
    return user;
  }
}

export async function registerWithEmail(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(auth, params.email, params.password);
  const firebaseToken = await credential.user.getIdToken();
  const { user, tokens } = await api.post<AuthResponse>('/auth/register', {
    firebaseToken,
    firstName: params.firstName,
    lastName: params.lastName,
  });
  useAuthStore.getState().setAuth(user, tokens);
  return user;
}

/**
 * Development-only sign-in that skips Firebase. Requires the API to run with
 * NODE_ENV=development; the endpoint does not exist otherwise.
 */
export async function devLogin(email: string): Promise<AuthUser> {
  const { user, tokens } = await api.post<AuthResponse>('/auth/dev-login', { email });
  useAuthStore.getState().setAuth(user, tokens);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Best-effort server-side revocation; always clear local state below.
  }
  await signOut(auth).catch(() => undefined);
  useAuthStore.getState().logout();
}
