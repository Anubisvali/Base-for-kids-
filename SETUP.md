# 🚀 Ghid de Setup - Base For Kids Mini App

Acest ghid te va ajuta să configurezi și să rulezi aplicația ta Farcaster Mini App.

## 📋 Cerințe Prealabile

- Node.js 18+ instalat
- npm sau pnpm
- Cont Neynar (recomandat)
- Cont Upstash (opțional, pentru notificări)

## 🔧 Pași de Instalare

### 1. Instalare Dependențe

```bash
npm install
# sau
pnpm install
```

### 2. Configurare Variabile de Mediu

1. Copiază fișierul `.env.example` ca `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Deschide `.env.local` și completează valorile:

   **Obligatoriu:**
   - `NEXT_PUBLIC_URL` - URL-ul aplicației tale
     - Development: `http://localhost:3000`
     - Producție: `https://your-domain.com`

   **Recomandat (Neynar):**
   - Obține cheia API de la [Neynar](https://neynar.com)
   - Completează `NEYNAR_API_KEY` și `NEYNAR_CLIENT_ID`
   - Necesar pentru funcționalități avansate (user data, notifications)

   **Opțional:**
   - `KV_REST_API_URL` și `KV_REST_API_TOKEN` - pentru notificări persistente
   - `SOLANA_RPC_ENDPOINT` - pentru integrare Solana
   - `SEED_PHRASE` și `SPONSOR_SIGNER` - pentru signer sponsorship

### 3. Rulare în Development

```bash
npm run dev
```

Aplicația va rula pe `http://localhost:3000`.

### 4. Testare cu Farcaster Preview Tool

1. Instalează [ngrok](https://ngrok.com/download)
2. Într-un terminal nou, rulează:
   ```bash
   ngrok http 3000
   ```
3. Copiază URL-ul generat (ex: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)
4. Mergi la [Farcaster Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview)
5. Introdu URL-ul ngrok și apasă "Preview"

## 🏗️ Structura Aplicației

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── auth/          # Autentificare Farcaster
│   │   ├── users/         # User data
│   │   └── webhook/       # Webhook events
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # React providers
├── components/            # Componente React
│   ├── App.tsx            # Componenta principală
│   ├── providers/         # Context providers
│   └── ui/                # UI components
│       ├── tabs/          # Tab components
│       └── wallet/        # Wallet components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities și config
└── ...
```

## 🎯 Funcționalități Disponibile

### Tab-uri Disponibile

1. **Home Tab** - Mint NFT-uri pentru "Base For Kids"
2. **Actions Tab** - Acțiuni mini app (share, notifications, haptics)
3. **Context Tab** - Debug info (context Farcaster)
4. **Wallet Tab** - Gestionare wallet (EVM + Solana)

### Integrări

- ✅ **Farcaster SDK** - Integrare completă cu Farcaster
- ✅ **Neynar** - User data și notifications
- ✅ **Wagmi** - Wallet EVM (Base, Optimism, Degen, etc.)
- ✅ **Solana** - Wallet Solana
- ✅ **Upstash Redis** - Persistență pentru notifications

## 📦 Deployment

### Deployment pe Vercel

```bash
npm run deploy:vercel
```

Sau manual:
1. Conectează repository-ul la Vercel
2. Configurează variabilele de mediu în dashboard-ul Vercel
3. Deploy automat la fiecare push

### Build pentru Producție

```bash
npm run build
npm start
```

## 🔐 Securitate

⚠️ **IMPORTANT:**
- Nu comita niciodată `.env.local` în git
- Nu partaja seed phrase-urile
- Folosește variabile de mediu pentru toate cheile API
- Verifică că `.env.local` este în `.gitignore`

## 🐛 Troubleshooting

### Port deja folosit
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
npm run cleanup
```

### Eroare de conectare wallet
- Verifică că ești în Farcaster client (Warpcast, etc.)
- Verifică că `NEXT_PUBLIC_URL` este setat corect
- Verifică console-ul pentru erori

### Notificări nu funcționează
- Verifică că `NEYNAR_API_KEY` este setat
- Verifică că `KV_REST_API_URL` și `KV_REST_API_TOKEN` sunt setate
- Verifică că user-ul are token de notificare

## 📚 Resurse

- [Documentație Neynar](https://docs.neynar.com)
- [Farcaster Developers](https://farcaster.xyz/~/developers)
- [Next.js Docs](https://nextjs.org/docs)

## 🆘 Suport

Dacă întâmpini probleme:
1. Verifică că toate dependențele sunt instalate
2. Verifică că toate variabilele de mediu sunt setate
3. Verifică console-ul pentru erori
4. Consultă documentația oficială

---

**Baftă cu mini app-ul tău! 🎉**

