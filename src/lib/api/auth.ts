import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
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

async function exchangeFirebaseToken(
  firebaseToken: string,
  registration?: { firstName: string; lastName: string },
): Promise<AuthUser> {
  if (registration) {
    const { user, tokens } = await api.post<AuthResponse>('/auth/register', {
      firebaseToken,
      firstName: registration.firstName,
      lastName: registration.lastName,
    });
    useAuthStore.getState().setAuth(user, tokens);
    return user;
  }

  // Try login; fall back to auto-register for OAuth users who haven't signed up yet
  try {
    const { user, tokens } = await api.post<AuthResponse>('/auth/login', { firebaseToken });
    useAuthStore.getState().setAuth(user, tokens);
    return user;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === 'UNAUTHORIZED' || (err instanceof Error && err.message?.toLowerCase().includes('not found'))) {
      throw err;
    }
    throw err;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await credential.user.getIdToken();
  return exchangeFirebaseToken(firebaseToken);
}

export async function loginWithGoogle(): Promise<AuthUser> {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');

  let credential;
  try {
    credential = await signInWithPopup(auth, provider);
  } catch (err) {
    const code = (err as { code?: string }).code;
    // Popup blocked on some mobile browsers — fall back to redirect
    if (code === 'auth/popup-blocked' || code === 'auth/popup-cancelled') {
      await signInWithRedirect(auth, provider);
      // signInWithRedirect navigates away; result is handled by consumeGoogleRedirect on next load
      return Promise.reject(new Error('Redirecting for sign-in…'));
    }
    throw err;
  }

  const firebaseToken = await credential.user.getIdToken();
  const displayName = credential.user.displayName ?? '';
  const [first, ...rest] = displayName.split(' ');

  // Try login first; if user doesn't exist in our DB yet, register them
  try {
    const { user, tokens } = await api.post<AuthResponse>('/auth/login', { firebaseToken });
    useAuthStore.getState().setAuth(user, tokens);
    return user;
  } catch {
    const { user, tokens } = await api.post<AuthResponse>('/auth/register', {
      firebaseToken,
      firstName: first || 'Customer',
      lastName: rest.join(' ') || '',
    });
    useAuthStore.getState().setAuth(user, tokens);
    return user;
  }
}

/**
 * Called on app mount to handle the result from signInWithRedirect (mobile fallback).
 * Returns the user if a redirect sign-in just completed, null otherwise.
 */
export async function consumeGoogleRedirect(): Promise<AuthUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;

    const firebaseToken = await result.user.getIdToken();
    const displayName = result.user.displayName ?? '';
    const [first, ...rest] = displayName.split(' ');

    try {
      const { user, tokens } = await api.post<AuthResponse>('/auth/login', { firebaseToken });
      useAuthStore.getState().setAuth(user, tokens);
      return user;
    } catch {
      const { user, tokens } = await api.post<AuthResponse>('/auth/register', {
        firebaseToken,
        firstName: first || 'Customer',
        lastName: rest.join(' ') || '',
      });
      useAuthStore.getState().setAuth(user, tokens);
      return user;
    }
  } catch {
    return null;
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
  return exchangeFirebaseToken(firebaseToken, {
    firstName: params.firstName,
    lastName: params.lastName,
  });
}

export async function devLogin(email: string): Promise<AuthUser> {
  const { user, tokens } = await api.post<AuthResponse>('/auth/dev-login', { email });
  useAuthStore.getState().setAuth(user, tokens);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // best-effort server-side revocation
  }
  await signOut(auth).catch(() => undefined);
  useAuthStore.getState().logout();
}
