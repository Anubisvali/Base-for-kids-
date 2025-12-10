// src/lib/contracts.ts
import { getAddress } from 'viem';

// Adresa contractului tău Base For Kids
export const BFK_CONTRACT_ADDRESS = getAddress(
  '0xC4261E58085962D15c5628F39C653D33c1d585cF'
);

// Prețul NFT în Wei (0.00168 ETH / BASE * 10^18)
export const MINT_PRICE_WEI = 1680000000000000n; 

// Limita maximă de mint-uri
export const MAX_MINT_PER_WALLET = 25;

// Total maxim de NFT-uri disponibile (dacă nu poate fi citit din contract)
// Poate fi actualizat manual sau citit din contract dacă există funcția maxTotalSupply
export const MAX_TOTAL_SUPPLY = 10000; // Ajustează acest număr conform contractului tău