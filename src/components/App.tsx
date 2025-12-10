"use client";

import { useEffect, useRef, startTransition } from "react";
import { useMiniApp } from "@neynar/react";
import { sdk } from "@farcaster/miniapp-sdk";

import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { HomeTab, WalletTab } from "~/components/ui/tabs";
import { USE_WALLET } from "~/lib/constants";
import { useNeynarUser } from "~/hooks/useNeynarUser";

// --- Types ---
export enum Tab {
  Home = "home",
  Actions = "actions",
  Context = "context",
  Wallet = "wallet",
}

export interface AppProps {
  title?: string;
}

/**
 * App component – container principal pentru mini app.
 */
export default function App({ title }: AppProps = { title: "Base For Kids" }) {
  const { isSDKLoaded, context, setInitialTab, setActiveTab, currentTab } = useMiniApp();
  const { user: neynarUser } = useNeynarUser(context || undefined);
  const hasCalledReady = useRef(false);

  // setează tab-ul inițial
  useEffect(() => {
    if (isSDKLoaded) {
      // Folosim startTransition pentru a evita erorile useInsertionEffect
      startTransition(() => {
        setInitialTab(Tab.Home);
      });
    }
  }, [isSDKLoaded, setInitialTab]);

  // Redirecționează automat la Home dacă se încearcă accesarea tab-urilor Actions sau Context
  useEffect(() => {
    if (currentTab === Tab.Actions || currentTab === Tab.Context) {
      // Folosim startTransition pentru a evita erorile de useInsertionEffect
      startTransition(() => {
        setActiveTab(Tab.Home);
      });
    }
  }, [currentTab, setActiveTab]);

  // semnalizează către Farcaster că mini-app-ul e gata
  // Conform documentației oficiale: https://miniapps.farcaster.xyz/docs/getting-started#making-your-app-display
  // "After your app loads, you must call sdk.actions.ready() to hide the splash screen and display your content"
  // "Important: If you don't call ready(), users will see an infinite loading screen."
  useEffect(() => {
    if (hasCalledReady.current) return;

    const callReady = async () => {
      try {
        // Apelăm ready() conform documentației oficiale
        // https://miniapps.farcaster.xyz/docs/getting-started#making-your-app-display
        await sdk.actions.ready();
        hasCalledReady.current = true;
        console.log("✅ Base For Kids mini app: sdk.actions.ready() called - interface ready");
      } catch (error) {
        console.error("❌ Failed to call sdk.actions.ready()", error);
        // Retry după un scurt delay
        if (!hasCalledReady.current) {
          setTimeout(async () => {
            if (!hasCalledReady.current) {
              try {
                await sdk.actions.ready();
                hasCalledReady.current = true;
                console.log("✅ Base For Kids mini app: sdk.actions.ready() called (retry)");
              } catch (retryError) {
                console.error("❌ Retry failed:", retryError);
              }
            }
          }, 300);
        }
      }
    };

    // Folosim double RAF pentru a ne asigura că DOM-ul este complet gata
    // Conform best practices pentru a evita content reflow
    const rafId1 = requestAnimationFrame(() => {
      const rafId2 = requestAnimationFrame(() => {
        // Apelăm ready() după ce DOM-ul este complet renderat
        callReady();
      });
      
      // Cleanup pentru rafId2
      return () => {
        if (rafId2) cancelAnimationFrame(rafId2);
      };
    });

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
    };
  }, []); // Rulează o singură dată la montarea componentei

  // Nu mai blocăm renderarea dacă SDK-ul nu e încărcat
  // Renderăm interfața imediat și apelăm ready() când e posibil

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <Header neynarUser={neynarUser} />

      <div className="min-h-screen">
        {currentTab === Tab.Home && <HomeTab />}
        {currentTab === Tab.Wallet && <WalletTab />}

        {/* Footer ascuns conform cererii */}
        {/* <Footer activeTab={currentTab as Tab} setActiveTab={setActiveTab} showWallet={USE_WALLET} /> */}
      </div>
    </div>
  );
}
