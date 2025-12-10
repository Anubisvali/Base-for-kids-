"use client";

import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { sdk } from "@farcaster/miniapp-sdk";

const FarcasterSolanaProvider = dynamic(
  () =>
    import("@farcaster/mini-app-solana").then(
      (mod) => mod.FarcasterSolanaProvider
    ),
  { ssr: false }
);

type SafeFarcasterSolanaProviderProps = {
  endpoint: string;
  children: ReactNode;
};

const SolanaProviderContext = createContext<{ hasSolanaProvider: boolean }>({
  hasSolanaProvider: false,
});

export function SafeFarcasterSolanaProvider({
  endpoint,
  children,
}: SafeFarcasterSolanaProviderProps) {
  const [hasSolanaProvider, setHasSolanaProvider] =
    useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  // verificăm o singură dată pe client dacă există Solana provider
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const provider = await sdk.wallet.getSolanaProvider();
        if (!cancelled) {
          setHasSolanaProvider(!!provider);
        }
      } catch {
        if (!cancelled) {
          setHasSolanaProvider(false);
        }
      } finally {
        if (!cancelled) {
          setChecked(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // până terminăm verifica­rea nu randăm nimic
  if (!checked) return null;

  return (
    <SolanaProviderContext.Provider value={{ hasSolanaProvider }}>
      {hasSolanaProvider ? (
        <FarcasterSolanaProvider endpoint={endpoint}>
          {children}
        </FarcasterSolanaProvider>
      ) : (
        <>{children}</>
      )}
    </SolanaProviderContext.Provider>
  );
}

export function useHasSolanaProvider() {
  return useContext(SolanaProviderContext).hasSolanaProvider;
}
