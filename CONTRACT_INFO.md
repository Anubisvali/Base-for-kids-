# Informații Contract - Base For Kids NFT

## 📋 Detalii Contract

- **Adresă Contract**: `0xC4261E58085962D15c5628F39C653D33c1d585cF`
- **Rețea**: Base (Chain ID: 8453)
- **Tip Contract**: Thirdweb DropERC721
- **Preț Mint**: 0.00168 BASE ETH (1680000000000000 Wei)
- **Limită per Wallet**: 25 NFT-uri

## 🔧 Funcția `claim`

Când utilizatorul apasă "Mint Now", se apelează funcția `claim` din contract cu următoarele parametri:

### Semnătură Funcție

```solidity
function claim(
    address _receiver,        // Adresa care va primi NFT-urile
    uint256 _quantity,        // Cantitatea de NFT-uri de mintat
    address _currency,        // Adresa token-ului de plată (0x0 pentru ETH nativ)
    uint256 _pricePerToken,   // Prețul per token în Wei
    bytes32[] _proofs,        // Array de proofs pentru allowlist (gol pentru public sale)
    bytes _data               // Date suplimentare (0x pentru public sale)
) payable
```

### Parametrii în Cod

În `src/components/ui/tabs/HomeTab.tsx`, funcția este apelată astfel:

```typescript
writeContract({
  address: BFK_CONTRACT_ADDRESS,  // 0xC4261E58085962D15c5628F39C653D33c1d585cF
  abi: BFK_ABI,
  functionName: 'claim',
  args: [
    address,                                    // 1. receiverAddress
    BigInt(quantity),                          // 2. quantity
    '0x0000000000000000000000000000000000000000', // 3. currencyAddress (ETH nativ)
    MINT_PRICE_WEI,                            // 4. pricePerToken (1680000000000000 Wei)
    [],                                        // 5. proofs (gol pentru Public Sale)
    '0x'                                       // 6. data (gol)
  ],
  value: totalValue,  // ETH trimis = quantity * MINT_PRICE_WEI
  chainId: 8453,      // Base network
});
```

## 💰 Calcul Cost

- **Preț per NFT**: 0.00168 BASE ETH
- **Cost Total**: `quantity × 0.00168 BASE ETH`
- **Exemplu**: Pentru 2 NFT-uri = 0.00336 BASE ETH

## 🔗 Link-uri Utile

- **Base Explorer**: [https://basescan.org/address/0xC4261E58085962D15c5628F39C653D33c1d585cF](https://basescan.org/address/0xC4261E58085962D15c5628F39C653D33c1d585cF)
- **Thirdweb Docs**: [https://portal.thirdweb.com/contracts](https://portal.thirdweb.com/contracts)

## ⚠️ Note Importante

1. **Wallet Conectat**: Utilizatorul trebuie să aibă wallet-ul conectat înainte de mint
2. **Balanță Suficientă**: Wallet-ul trebuie să aibă suficient ETH pentru a acoperi costul
3. **Rețea Corectă**: Wallet-ul trebuie să fie pe rețeaua Base (Chain ID: 8453)
4. **Limită Wallet**: Maxim 25 NFT-uri per wallet
5. **Public Sale**: Proofs și data sunt goale pentru că este public sale

## 🐛 Troubleshooting

### Eroare: "Insufficient funds"
- Verifică că wallet-ul are suficient ETH pe Base
- Verifică că prețul este corect calculat

### Eroare: "Transaction failed"
- Verifică că wallet-ul este pe rețeaua Base
- Verifică că contractul este activ
- Verifică că nu ai depășit limita de 25 NFT-uri per wallet

### Eroare: "User rejected"
- Utilizatorul a anulat tranzacția în wallet

