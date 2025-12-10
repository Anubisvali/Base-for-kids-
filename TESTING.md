# 🧪 Ghid de Testare - Base For Kids Mini App

## ✅ Checklist Pre-Testare

Înainte de a testa aplicația pe [Farcaster Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview), asigură-te că:

### 1. Aplicația Rulează Local
```bash
npm run dev
```
Aplicația ar trebui să ruleze pe `http://localhost:3000` (sau alt port configurat).

### 2. Ngrok Tunnel este Activ
```bash
ngrok http 3000
```
Sau pentru portul tău specific:
```bash
ngrok http <PORT>
```

**URL-ul tău ngrok**: `https://roxann-iridic-synonymously.ngrok-free.dev/`

### 3. Variabile de Mediu (Opțional)
Pentru funcționalități complete, configurează în `.env.local`:
- `NEXT_PUBLIC_URL=https://roxann-iridic-synonymously.ngrok-free.dev`
- `NEYNAR_API_KEY` (opțional, pentru user data)
- `NEYNAR_CLIENT_ID` (opțional)

**Notă**: Aplicația va funcționa și fără `NEXT_PUBLIC_URL` setat (folosește fallback automat).

## 🚀 Pași de Testare

### Pasul 1: Deschide Preview Tool
1. Mergi la: [https://farcaster.xyz/~/developers/mini-apps/preview](https://farcaster.xyz/~/developers/mini-apps/preview)
2. **IMPORTANT**: Trebuie să fii logat în Warpcast pe desktop

### Pasul 2: Introdu URL-ul
Introdu URL-ul ngrok:
```
https://roxann-iridic-synonymously.ngrok-free.dev/
```

### Pasul 3: Apasă "Preview"
După ce apesi "Preview", aplicația ar trebui să se încarce.

## 🔍 Ce să Verifici

### ✅ Loading
- [ ] Splash screen apare la început
- [ ] Splash screen se ascunde când interfața este gata
- [ ] Nu există erori în console
- [ ] Mesajul "✅ Base For Kids mini app: sdk.actions.ready() called" apare în console

### ✅ Interfața
- [ ] Header-ul se afișează corect
- [ ] Tab-urile funcționează (Home, Actions, Context, Wallet)
- [ ] Footer-ul cu navigare este vizibil
- [ ] Design-ul este responsive

### ✅ Funcționalități
- [ ] **Home Tab**: Poți selecta cantitatea de NFT-uri
- [ ] **Home Tab**: Prețul se calculează corect
- [ ] **Wallet Tab**: Poți conecta wallet-ul
- [ ] **Actions Tab**: Funcțiile de share funcționează
- [ ] **Context Tab**: Afișează informații despre context

### ✅ Mint Functionality
- [ ] Butonul "Mint Now" este vizibil când wallet-ul este conectat
- [ ] Poți apăsa "Mint Now" (nu trebuie să finalizezi tranzacția pentru test)
- [ ] Mesajele de eroare/succes se afișează corect

## 🐛 Probleme Comune

### Problema: "Failed to load"
**Soluție**:
- Verifică că ngrok rulează
- Verifică că aplicația rulează local
- Verifică că URL-ul ngrok este corect (cu `/` la final)

### Problema: "NEXT_PUBLIC_URL is not defined"
**Soluție**: 
- Aplicația are fallback automat, dar poți seta în `.env.local`:
  ```
  NEXT_PUBLIC_URL=https://roxann-iridic-synonymously.ngrok-free.dev
  ```

### Problema: Splash screen nu se ascunde
**Soluție**:
- Verifică console-ul pentru erori
- Verifică că `sdk.actions.ready()` este apelat
- Verifică că nu există erori JavaScript

### Problema: Wallet nu se conectează
**Soluție**:
- Verifică că ești în Farcaster client (Warpcast)
- Verifică că wallet-ul este configurat corect
- Verifică console-ul pentru erori de conectare

## 📊 Console Logs de Verificat

Când aplicația se încarcă corect, ar trebui să vezi în console:

```
✅ Base For Kids mini app: sdk.actions.ready() called - interface ready
```

Dacă vezi erori, notează-le și verifică:
- Erori de network (CORS, 404, etc.)
- Erori JavaScript
- Erori de SDK

## 🔗 Link-uri Utile

- **Preview Tool**: [https://farcaster.xyz/~/developers/mini-apps/preview](https://farcaster.xyz/~/developers/mini-apps/preview)
- **Ngrok Dashboard**: [https://dashboard.ngrok.com/](https://dashboard.ngrok.com/)
- **Base Explorer**: [https://basescan.org/](https://basescan.org/)

## ✅ Status Actual

Aplicația este **GATA** pentru testare! 

Toate optimizările au fost implementate:
- ✅ Loading optimizat conform documentației Farcaster
- ✅ Fallback pentru APP_URL
- ✅ Contract configurat corect
- ✅ ABI actualizat

**Poți testa acum!** 🚀

