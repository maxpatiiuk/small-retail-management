'use client';

import React from 'react';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { app, db } from '../lib/firebase';
import { State } from 'typesafe-reducer';
import { localization } from '../const/localization';
import { doc, getDoc } from 'firebase/firestore';

export function Auth({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactNode {
  const [auth, setAuth] = React.useState<Auth | undefined>(undefined);
  React.useEffect(() => {
    const auth = getAuth(app);
    auth.useDeviceLanguage();
    setAuth(auth);
  }, []);

  const [state, setState] = React.useState<
    | State<'SignedIn'>
    | State<'NotSignedIn', { readonly error?: string }>
    | State<'Loading'>
  >({ type: 'Loading' });

  React.useEffect(
    () =>
      auth === undefined
        ? undefined
        : onAuthStateChanged(auth, async (user) => {
            if (process.env.NODE_ENV === 'development') console.log({ user });
            const email = user?.email;
            if (typeof email === 'string') {
              const isAllowed = await isAllowedUser();
              setState(
                isAllowed
                  ? { type: 'SignedIn' }
                  : {
                      type: 'NotSignedIn',
                      error: localization.wrongEmail(email),
                    }
              );
            } else setState({ type: 'NotSignedIn' });
          }),
    [auth]
  );

  function signIn(): void {
    if (auth === undefined) return;
    setState({ type: 'Loading' });
    authenticate(auth).catch((error) => {
      console.error(error);
      setState({ type: 'NotSignedIn', error: error.message });
    });
  }

  return state.type === 'SignedIn' ? (
    children
  ) : state.type === 'Loading' || auth === undefined ? (
    <>{localization.loading}</>
  ) : (
    <>
      {typeof state.error === 'string' && <p role="alert">{state.error}</p>}
      <button onClick={signIn}>{localization.signIn}</button>
    </>
  );
}

async function authenticate(auth: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

/**
 * Only users with some emails are allowed to access the site.
 *
 * Try reading a non-existent path in the database - will throw if you
 * don't have permission
 */
const isAllowedUser = async (): Promise<boolean> =>
  getDoc(doc(db, 'auth-test', 'auth-test'))
    .then(() => true)
    .catch(() => false);
