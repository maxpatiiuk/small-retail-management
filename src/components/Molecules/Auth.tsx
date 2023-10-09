'use client';

import React from 'react';
import {
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { app } from '../../lib/firebase';
import { State } from 'typesafe-reducer';
import { localization } from '../../const/localization';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firestore';
import { Button } from '../Atoms/Button';

const auth = getAuth(app);
auth.useDeviceLanguage();

export function Auth({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactNode {
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
                    },
              );
            } else setState({ type: 'NotSignedIn' });
          }),
    [auth],
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
  ) : state.type === 'Loading' || auth === undefined ? undefined : (
    <>
      {typeof state.error === 'string' && <p role="alert">{state.error}</p>}
      <div>
        <Button.Info onClick={signIn}>{localization.signIn}</Button.Info>
      </div>
    </>
  );
}

async function authenticate(auth: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
}

/**
 * Only users with some emails are allowed to access the site.
 *
 * Try reading a non-existent path in the database - will throw if you
 * don't have permission
 */
const isAllowedUser = async (): Promise<boolean> =>
  getDoc(doc(db, 'employees', 'auth-test'))
    .then(() => true)
    .catch(() => false);
