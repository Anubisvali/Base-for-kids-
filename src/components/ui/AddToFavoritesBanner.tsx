'use client';

import { useState, useEffect } from 'react';
import { useMiniApp } from '@neynar/react';
import { Button } from './Button';

/**
 * AddToFavoritesBanner component - prompts users to add the mini app to favorites
 * 
 * This component displays a slide-up banner from the bottom asking users if they want
 * to add the mini app to their favorites. It follows Farcaster guidelines for UX.
 * 
 * The banner:
 * - Appears once per session (stored in sessionStorage)
 * - Slides up from the bottom with smooth animation
 * - Can be dismissed or used to add the app to favorites
 * - Only shows if the app is not already added
 */
export function AddToFavoritesBanner() {
  const { actions, added } = useMiniApp();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if we've already shown the banner in this session
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('favorites-banner-shown');
      if (shown === 'true') {
        setHasShown(true);
        return;
      }
    }

    // Only show if app is not already added and we haven't shown it yet
    if (!added && !hasShown) {
      // Delay appearance slightly for better UX (after app loads)
      const timer = setTimeout(() => {
        setIsVisible(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('favorites-banner-shown', 'true');
        }
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [added, hasShown]);

  const handleAdd = () => {
    actions.addMiniApp();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Don't show if already added or if we've already shown it
  if (added || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 animate-slide-up"
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="bg-gradient-to-r from-purple-600/95 to-blue-600/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-purple-400/30 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Add Base For Kids to Favorites?
            </h3>
            <p className="text-white/90 text-xs mb-3">
              Get quick access to mint NFTs and support children this Christmas.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all border border-white/30"
              >
                Add to Favorites
              </Button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-white/70 hover:text-white text-xs font-medium transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

