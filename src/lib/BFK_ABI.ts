// src/lib/BFK_ABI.ts
// ABI pentru contractul Thirdweb DropERC721 - Base For Kids
// Contract address: 0xC4261E58085962D15c5628F39C653D33c1d585cF (Base chain - Chain ID: 8453)
// 
// Funcția claim - bazată pe tranzacția reușită de pe Basescan:
// https://basescan.org/tx/0xbbde380698363320c79bb2686ae5742c54107132d8fadd2ab26c75359f8f5b86
// 
// Funcția folosește 6 parametri, unde al 5-lea este un tuple (struct) pentru allowlistProof
export const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "_receiver", "type": "address" },
      { "internalType": "uint256", "name": "_quantity", "type": "uint256" },
      { "internalType": "address", "name": "_currency", "type": "address" },
      { "internalType": "uint256", "name": "_pricePerToken", "type": "uint256" },
      {
        "components": [
          { "internalType": "bytes32[]", "name": "proof", "type": "bytes32[]" },
          { "internalType": "uint256", "name": "quantityLimitPerWallet", "type": "uint256" },
          { "internalType": "uint256", "name": "pricePerToken", "type": "uint256" },
          { "internalType": "address", "name": "currency", "type": "address" }
        ],
        "internalType": "struct IDrop.AllowlistProof",
        "name": "_allowlistProof",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "_data", "type": "bytes" }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextTokenIdToMint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxTotalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveClaimConditionId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_conditionId", "type": "uint256" }],
    "name": "getClaimConditionById",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "startTimestamp", "type": "uint256" },
          { "internalType": "uint256", "name": "maxClaimableSupply", "type": "uint256" },
          { "internalType": "uint256", "name": "supplyClaimed", "type": "uint256" },
          { "internalType": "uint256", "name": "quantityLimitPerWallet", "type": "uint256" },
          { "internalType": "bytes32", "name": "merkleRoot", "type": "bytes32" },
          { "internalType": "uint256", "name": "pricePerToken", "type": "uint256" },
          { "internalType": "address", "name": "currency", "type": "address" },
          { "internalType": "string", "name": "metadata", "type": "string" }
        ],
        "internalType": "struct IDropClaimCondition.ClaimCondition",
        "name": "condition",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
