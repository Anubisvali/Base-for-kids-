// src/components/ui/tabs/HomeTab.tsx
'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useConnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { BFK_CONTRACT_ADDRESS, MINT_PRICE_WEI, MAX_MINT_PER_WALLET, MAX_TOTAL_SUPPLY } from '../../../lib/contracts';
import { abi as BFK_ABI } from '../../../lib/BFK_ABI';
import { Button } from '../Button';
import { ShareButton } from '../Share';
import { useMiniApp } from '@neynar/react';
import { APP_URL } from '~/lib/constants';
import { Tab } from '../../App';

interface HomeTabProps {
  setActiveTab?: (tab: Tab) => void;
}

export function HomeTab({ setActiveTab }: HomeTabProps = {}) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [quantity, setQuantity] = useState(1);
  const { context, setActiveTab: setActiveTabFromSDK } = useMiniApp();
  
  // Use SDK's setActiveTab if available, otherwise use prop
  const handleSetActiveTab = setActiveTabFromSDK || setActiveTab;
  
  // Calculează valoarea totală (Preț * Cantitate) în Wei
  const totalValue = BigInt(quantity) * MINT_PRICE_WEI;
  const pricePerNFT = Number(MINT_PRICE_WEI) / 10**18;
  
  // Hook-uri Wagmi pentru a scrie și a monitoriza tranzacția
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    error: receiptError 
  } = useWaitForTransactionReceipt({ hash });

  // Citește totalul de NFT-uri mintuite din contract
  // totalSupply returnează numărul real de token-uri mintuite
  const { data: totalMinted, refetch: refetchTotalMinted, error: totalSupplyError } = useReadContract({
    address: BFK_CONTRACT_ADDRESS,
    abi: BFK_ABI,
    functionName: 'totalSupply',
    chainId: 8453,
  });

  // Fallback: dacă totalSupply nu există, folosește nextTokenIdToMint (scade 1 dacă ID-urile încep de la 1)
  const { data: nextTokenId } = useReadContract({
    address: BFK_CONTRACT_ADDRESS,
    abi: BFK_ABI,
    functionName: 'nextTokenIdToMint',
    chainId: 8453,
    query: {
      enabled: !!totalSupplyError, // Doar dacă totalSupply a eșuat
    },
  });

  // Citește maxTotalSupply dacă există
  const { data: maxSupply } = useReadContract({
    address: BFK_CONTRACT_ADDRESS,
    abi: BFK_ABI,
    functionName: 'maxTotalSupply',
    chainId: 8453,
  });

  // Citește active claim condition pentru a obține maxClaimableSupply și supplyClaimed
  // Aceasta este metoda folosită de Thirdweb pentru a afișa "Supply Claimed"
  const { data: activeConditionId } = useReadContract({
    address: BFK_CONTRACT_ADDRESS,
    abi: BFK_ABI,
    functionName: 'getActiveClaimConditionId',
    chainId: 8453,
  });

  const { data: claimConditionData } = useReadContract({
    address: BFK_CONTRACT_ADDRESS,
    abi: BFK_ABI,
    functionName: 'getClaimConditionById',
    args: activeConditionId !== undefined ? [activeConditionId] : undefined,
    chainId: 8453,
    query: {
      enabled: activeConditionId !== undefined,
    },
  });

  // Wagmi returnează tuple-urile ca array sau ca obiect în funcție de ABI
  // Funcția returnează un tuple cu un singur element numit "condition"
  const claimCondition = claimConditionData 
    ? (Array.isArray(claimConditionData) ? claimConditionData[0] : claimConditionData)
    : null;

  // Actualizează totalul mintuit după fiecare mint reușit
  useEffect(() => {
    if (isConfirmed) {
      // Delay mic pentru a permite blockchain-ului să se actualizeze
      const timer = setTimeout(() => {
        refetchTotalMinted();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, refetchTotalMinted]);

  // Calculează valorile pentru bară de progres
  // Folosim totalSupply (standard ERC721) pentru minted
  // Folosim MAX_TOTAL_SUPPLY sau maxTotalSupply pentru max
  
  // Helper function pentru a converti BigInt la Number în siguranță
  const safeBigIntToNumber = (value: unknown): number => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'bigint') {
      // Verifică dacă BigInt-ul este în range-ul sigur pentru Number
      const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
      if (value > maxSafe) {
        console.warn('BigInt value too large:', value.toString());
        return 0;
      }
      return Number(value);
    }
    if (typeof value === 'number') {
      // Verifică dacă numărul este valid și rezonabil
      if (isNaN(value) || !isFinite(value) || value < 0 || value > 1000000) {
        return 0;
      }
      return value;
    }
    const num = Number(value);
    if (isNaN(num) || !isFinite(num) || num < 0 || num > 1000000) {
      return 0;
    }
    return num;
  };

  // Folosim totalSupply pentru minted (standard ERC721)
  let minted = 0;
  if (totalMinted !== undefined && totalMinted !== null) {
    minted = safeBigIntToNumber(totalMinted);
  }

  // Folosim maxTotalSupply sau MAX_TOTAL_SUPPLY pentru max
  let max = MAX_TOTAL_SUPPLY;
  if (maxSupply !== undefined && maxSupply !== null) {
    const maxSupplyNum = safeBigIntToNumber(maxSupply);
    if (maxSupplyNum > 0) {
      max = maxSupplyNum;
    }
  }
  
  // Asigură-te că valorile sunt rezonabile
  if (minted < 0 || minted > 1000000) {
    console.warn('⚠️ Invalid minted value:', minted);
    minted = 0;
  }
  if (max < 1 || max > 1000000) {
    console.warn('⚠️ Invalid max value:', max);
    max = MAX_TOTAL_SUPPLY;
  }
  
  const percentage = max > 0 ? Math.min((minted / max) * 100, 100) : 0;

  // Funcția care declanșează tranzacția
  const handleMint = () => {
    console.log('🔵 handleMint called');
    console.log('writeContract:', !!writeContract);
    console.log('isConnected:', isConnected);
    console.log('address:', address);
    
    if (!writeContract) {
      console.error('❌ writeContract is not available');
      return;
    }
    
    if (!isConnected) {
      console.error('❌ Wallet is not connected');
      return;
    }
    
    if (!address) {
      console.error('❌ Address is not available');
      return;
    }

    console.log('✅ Calling writeContract with:', {
      address: BFK_CONTRACT_ADDRESS,
      quantity,
      totalValue: totalValue.toString(),
      chainId: 8453,
    });

    try {
      writeContract({
        address: BFK_CONTRACT_ADDRESS,
        abi: BFK_ABI,
        functionName: 'claim', 
        args: [
          address,
          BigInt(quantity),
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          MINT_PRICE_WEI,
          {
            proof: [],
            quantityLimitPerWallet: 0n,
            pricePerToken: 0n,
            currency: '0x0000000000000000000000000000000000000000'
          },
          '0x'
        ], 
        value: totalValue,
        chainId: 8453,
      });
      console.log('✅ writeContract called successfully');
    } catch (error) {
      console.error('❌ Error calling writeContract:', error);
    }
  };

  const isDisabled = !isConnected || isPending || isConfirming;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Cadouri cu parașută animați */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-gift-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              opacity: 0.6,
            }}
          >
            <div className="flex flex-col items-center">
              {/* Parașută */}
              <div className="text-blue-300 text-xs mb-0.5" style={{ fontSize: '10px' }}>
                🪂
              </div>
              {/* Cadou */}
              <div className="text-blue-400" style={{ fontSize: '14px' }}>
                🎁
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lumini bokeh de fundal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 blur-xl animate-pulse"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 py-6 pb-24">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-3">
          <div className="inline-block bg-purple-500/20 text-purple-300 text-xs font-medium px-3 py-1 rounded-full">
            Mint with purpose on Base
          </div>
            <a
              href="https://opensea.io/collection/base-for-kids-387420358"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              View on OpenSea
            </a>
            {isConnected && handleSetActiveTab && (
              <button
                onClick={() => handleSetActiveTab(Tab.Collection)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>🎁</span>
                My Collection
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Base For Kids</h1>
          
          {/* Imaginea Moș Crăciun cu cadoul */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-xs">
              <img 
                src="/Base-for-kids-cover.png" 
                alt="Base For Kids - Moș Crăciun cu cadou"
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))' }}
              />
            </div>
          </div>

          {/* Progress Bar - Minted NFTs */}
          <div className="mb-4 bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/90 text-sm font-medium">NFTs Minted</span>
              <span className="text-green-400 font-bold text-sm">
                {minted.toLocaleString()} / {max.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-2 text-center">
              {percentage.toFixed(1)}% of total
            </p>
          </div>
          
          <p className="text-white/90 text-sm leading-relaxed">
            Every mint funds a Christmas gift for an abandoned child and grants you lasting benefits as part of the Base For Kids community.
          </p>
        </div>

        {/* Three Steps */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">1</div>
            <p className="text-white text-xs">Mint an NFT on Base and support a real Christmas gift.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">2</div>
            <p className="text-white text-xs">Funds are used to buy presents for abandoned children.</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">3</div>
            <p className="text-white text-xs">Holders unlock future perks, drops and community access.</p>
          </div>
        </div>

        {/* Mint Section */}
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 mb-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-white/70 text-sm">Price per NFT</p>
              <p className="text-green-400 font-bold text-lg">{pricePerNFT} ETH</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Total</p>
              <p className="text-green-400 font-bold text-lg">{(pricePerNFT * quantity).toFixed(5)} ETH</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isDisabled}
                className="w-10 h-10 rounded-lg bg-gray-700/60 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/60 transition-colors border border-purple-500/30"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value) || 1), MAX_MINT_PER_WALLET))}
                min="1"
                max={MAX_MINT_PER_WALLET}
                className="w-16 text-center text-white font-bold bg-gray-700/60 rounded-lg py-2 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isDisabled}
              />
              <button
                onClick={() => setQuantity(Math.min(MAX_MINT_PER_WALLET, quantity + 1))}
                disabled={quantity >= MAX_MINT_PER_WALLET || isDisabled}
                className="w-10 h-10 rounded-lg bg-gray-700/60 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/60 transition-colors border border-purple-500/30"
              >
                +
              </button>
            </div>
            <p className="text-white/70 text-sm">Max 25 per wallet</p>
          </div>

          {/* Connect Wallet Button or Mint Button */}
          {!isConnected ? (
            <div className="space-y-3">
              <Button
                onClick={() => {
                  if (connectors.length > 0) {
                    // Încearcă să conecteze cu primul connector disponibil (Farcaster Frame)
                    connect({ connector: connectors[0] });
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Connect Wallet
              </Button>
              {connectors.length > 1 && (
                <div className="space-y-2">
                  <p className="text-white/70 text-xs text-center">Or connect with:</p>
                  {connectors.slice(1).map((connector) => (
                    <Button
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      className="w-full bg-gray-700/60 hover:bg-gray-600/60 text-white font-medium py-2 rounded-lg transition-all duration-200 border border-purple-500/30"
                    >
                      Connect {connector.name}
                    </Button>
                  ))}
                </div>
              )}
              <p className="text-white/70 text-xs text-center mt-2">
                Connect your wallet to mint NFTs
              </p>
            </div>
          ) : (
            <>
              <Button
                onClick={handleMint}
                disabled={isDisabled}
                isLoading={isPending || isConfirming}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-purple-400"
              >
                {isPending ? 'Waiting for signature...' : 
                 isConfirming ? 'Transaction in progress...' : 
                 `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`}
              </Button>
              {/* Status Messages */}
              {isConfirmed && (
                <div className="mt-4 space-y-3">
                  <p className="text-green-400 text-sm text-center font-medium">
                    Mint Successful! 🎉
                  </p>
                  {/* Share Cast Button */}
                  <ShareButton
                    buttonText="Share Your Mint on Farcaster"
                    cast={{
                      text: `Just minted ${quantity} Base For Kids NFT${quantity > 1 ? 's' : ''}! 🎁 Every mint funds a Christmas gift for an abandoned child. Join the cause on Base!`,
                      embeds: [`${APP_URL}/share/${context?.user?.fid || ''}`],
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  />
                </div>
              )}
              {(writeError || receiptError) && (
                <p className="text-red-400 text-sm mt-3 text-center">
                  Error: Transaction failed or was rejected.
                </p>
              )}
            </>
          )}

          <p className="text-white/50 text-xs mt-4 text-center">
            Prices and limits are enforced on-chain by the smart contract on Base. Future utilities for holders will be announced on Farcaster.
          </p>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* How Base For Kids works */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-white font-bold mb-3">How Base For Kids works</h3>
            <ul className="space-y-2 text-white/90 text-sm">
              <li>• You mint an NFT on Base from our collection.</li>
              <li>• The mint price goes into a dedicated wallet for gifts.</li>
              <li>• We buy real Christmas presents for abandoned kids.</li>
            </ul>
          </div>

          {/* Why hold a Base For Kids NFT? */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-white font-bold mb-3">Why hold a Base For Kids NFT?</h3>
            <ul className="space-y-2 text-white/90 text-sm">
              <li>• You&apos;ve helped a child receive a real Christmas gift.</li>
              <li>• Access to future drops, surprises and experiments.</li>
              <li>• Priority for future Base For Kids mini-apps & frames.</li>
              <li>• Being part of a community that actually gives back.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
