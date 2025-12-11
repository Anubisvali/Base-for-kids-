'use client';

import { useAccount, useReadContract, useConnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { BFK_CONTRACT_ADDRESS } from '../../../lib/contracts';
import { abi as BFK_ABI } from '../../../lib/BFK_ABI';
import { Button } from '../Button';

/**
 * CollectionTab component - displays user's owned Base For Kids NFTs
 * 
 * Shows:
 * - Number of NFTs owned
 * - List of owned token IDs
 * - Links to view on OpenSea and Basescan
 * - Beautiful Christmas-themed design
 */
export function CollectionTab() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [ownedTokens, setOwnedTokens] = useState<bigint[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  // Read balance of NFTs owned by user
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: BFK_CONTRACT_ADDRESS,
    abi: BFK_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: 8453,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Refetch balance when address changes or after mint
  useEffect(() => {
    if (address && isConnected) {
      refetchBalance();
    }
  }, [address, isConnected, refetchBalance]);

  const balanceNumber = balance ? Number(balance) : 0;
  // OpenSea URL for user's collection filtered by contract
  const openseaUrl = `https://opensea.io/assets/base/${BFK_CONTRACT_ADDRESS}?search[query]=${address}`;
  const basescanUrl = `https://basescan.org/address/${address}#tokentxnsErc721`;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden px-4 py-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-gift-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                opacity: 0.4,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="text-blue-300 text-xs mb-0.5" style={{ fontSize: '10px' }}>
                  🪂
                </div>
                <div className="text-blue-400" style={{ fontSize: '14px' }}>
                  🎁
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-md mx-auto">
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-white mb-3">My Collection</h2>
            <p className="text-white/70 text-sm mb-6">
              Connect your wallet to view your Base For Kids NFTs
            </p>
            <Button
              onClick={() => {
                if (connectors.length > 0) {
                  connect({ connector: connectors[0] });
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden px-4 py-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-gift-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              opacity: 0.4,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="text-blue-300 text-xs mb-0.5" style={{ fontSize: '10px' }}>
                🪂
              </div>
              <div className="text-blue-400" style={{ fontSize: '14px' }}>
                🎁
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">My Collection</h2>
          <p className="text-white/70 text-sm">
            Your Base For Kids NFTs
          </p>
        </div>

        {/* Collection Stats */}
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-2xl mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎁</div>
            <div className="text-4xl font-bold text-green-400 mb-2">
              {isLoadingTokens ? '...' : balanceNumber}
            </div>
            <p className="text-white/70 text-sm mb-4">
              {balanceNumber === 1 ? 'NFT Owned' : 'NFTs Owned'}
            </p>
            {balanceNumber > 0 && (
              <p className="text-white/90 text-xs mb-4">
                Each NFT represents a Christmas gift funded for an abandoned child. Thank you for your support! ❤️
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {balanceNumber > 0 ? (
          <div className="space-y-3">
            <a
              href={openseaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                View on OpenSea
              </Button>
            </a>
            <a
              href={basescanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-gray-700/60 hover:bg-gray-600/60 text-white font-medium py-3 rounded-lg transition-all duration-200 border border-purple-500/30 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Basescan
              </Button>
            </a>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
            <div className="text-4xl mb-3">🎄</div>
            <p className="text-white/90 text-sm mb-4">
              You don&apos;t own any Base For Kids NFTs yet.
            </p>
            <p className="text-white/70 text-xs">
              Mint your first NFT to start your collection and support a child this Christmas!
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-white font-bold mb-2 text-sm">About Your Collection</h3>
          <ul className="space-y-1 text-white/90 text-xs">
            <li>• Each NFT represents a real Christmas gift for an abandoned child</li>
            <li>• Holders get access to future drops and community perks</li>
            <li>• Your NFTs are stored securely on Base blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

