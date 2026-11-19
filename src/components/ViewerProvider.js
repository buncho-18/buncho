'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const ViewerContext = createContext({ loaded: false, signedIn: false, isPro: false, admin: false, profile: null });

export function useViewer() {
  return useContext(ViewerContext);
}

export default function ViewerProvider({ children }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [info, setInfo] = useState(null);
  const [infoFor, setInfoFor] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId || infoFor === userId) return undefined;
    let cancelled = false;
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.signedIn) return;
        setInfo({ isPro: Boolean(data.isPro), admin: Boolean(data.admin), profile: data.profile ?? null });
        setInfoFor(userId);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId, infoFor]);

  const value = useMemo(() => {
    const signedIn = Boolean(isLoaded && isSignedIn);
    const ready = signedIn && infoFor === userId && info;
    return {
      loaded: Boolean(isLoaded),
      signedIn,
      pending: signedIn && !ready,
      isPro: ready ? info.isPro : false,
      admin: ready ? info.admin : false,
      profile: ready ? info.profile : null,
    };
  }, [isLoaded, isSignedIn, userId, info, infoFor]);

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
}