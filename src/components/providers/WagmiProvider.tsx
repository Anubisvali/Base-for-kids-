// src/providers/WagmiProvider.tsx

import { createConfig, http, WagmiProvider } from "wagmi";
import { base, degen, mainnet, optimism, unichain, celo } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { APP_NAME, APP_ICON_URL, APP_URL } from "~/lib/constants";
import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import React from "react";

// Hook-ul custom 'useCoinbaseWalletAutoConnect' este comentat pentru a preveni
// conflictele de conexiune în mediul Farcaster/Mini App, care cauzează eșecul tranzacțiilor.
/*
function useCoinbaseWalletAutoConnect() {
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    const checkCoinbaseWallet = () => {
      const isInCoinbaseWallet = window.ethereum?.isCoinbaseWallet || 
        window.ethereum?.isCoinbaseWalletExtension ||
        window.ethereum?.isCoinbaseWalletBrowser;
      setIsCoinbaseWallet(!!isInCoinbaseWallet);
    };
    
    checkCoinbaseWallet();
    window.addEventListener('ethereum#initialized', checkCoinbaseWallet);
    
    return () => {
      window.removeEventListener('ethereum#initialized', checkCoinbaseWallet);
    };
  }, []);

  useEffect(() => {
    if (isCoinbaseWallet && !isConnected) {
      // ATENȚIE: conectează doar dacă conectorul Coinbase Wallet este la indexul 1
      connect({ connector: connectors[1] }); 
    }
  }, [isCoinbaseWallet, isConnected, connect, connectors]);

  return isCoinbaseWallet;
}
*/

// Configurația principală Wagmi
export const config = createConfig({
  chains: [base, optimism, mainnet, degen, unichain, celo],
  transports: {
    // Base are nevoie de un nod RPC explicit pentru tranzacții stabile
    [base.id]: http('https://mainnet.base.org'), 
    [optimism.id]: http('https://mainnet.optimism.io'),
    [mainnet.id]: http('https://eth.llamaserver.io'),
    [degen.id]: http(), 
    [unichain.id]: http(), 
    [celo.id]: http(), 
  },
  connectors: [
    farcasterFrame(), // Conectorul pentru Farcaster/Mini App
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: APP_ICON_URL,
      preference: 'all',
    }),
    metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: APP_URL,
      },
    }),
  ],
});

// QueryClient configurat pentru a evita erorile useInsertionEffect cu React 19
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Folosim startTransition pentru a evita erorile useInsertionEffect
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componenta 'CoinbaseWalletAutoConnect' este comentată/eliminată
/*
function CoinbaseWalletAutoConnect({ children }: { children: React.ReactNode }) {
  useCoinbaseWalletAutoConnect();
  return <>{children}</>;
}
*/

// Provider-ul principal care folosește WagmiProvider
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Elimină wrapper-ul 'CoinbaseWalletAutoConnect' */}
        {children} 
      </QueryClientProvider>
    </WagmiProvider>
  );
}