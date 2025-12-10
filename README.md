# Base For Kids - Farcaster Mini App 🎁

Aplicație Farcaster Mini App pentru mint NFT-uri caritabile. Fiecare mint finanțează un cadou de Crăciun pentru un copil abandonat și îți oferă beneficii permanente ca parte a comunității Base For Kids.

This is a [NextJS](https://nextjs.org/) + TypeScript + React app built with [Neynar's Farcaster Mini App template](https://docs.neynar.com/docs/create-farcaster-miniapp-in-60s).

## Guide

Check out [this Neynar docs page](https://docs.neynar.com/docs/create-farcaster-miniapp-in-60s) for a simple guide on how to create a Farcaster Mini App in less than 60 seconds!

## 🚀 Getting Started

### Quick Start

1. **Instalează dependențele:**
   ```bash
   npm install
   ```

2. **Configurează variabilele de mediu:**
   - Copiază `.env.example` ca `.env.local` (dacă există)
   - Completează valorile necesare (vezi [SETUP.md](./SETUP.md) pentru detalii)

3. **Rulează aplicația:**
   ```bash
   npm run dev
   ```

4. **Testează în Farcaster:**
   - Folosește [ngrok](https://ngrok.com) pentru a expune localhost
   - Testează cu [Farcaster Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview)

### 📖 Documentație Completă

Pentru instrucțiuni detaliate de setup, vezi [SETUP.md](./SETUP.md).

### Variabile de Mediu Necesare

- `NEXT_PUBLIC_URL` - URL-ul aplicației (obligatoriu)
- `NEYNAR_API_KEY` - Cheia API Neynar (recomandat)
- `NEYNAR_CLIENT_ID` - Client ID Neynar (recomandat)
- `KV_REST_API_URL` - Upstash Redis URL (opțional, pentru notificări)
- `KV_REST_API_TOKEN` - Upstash Redis Token (opțional)

### Importing the CLI
To invoke the CLI directly in JavaScript, add the npm package to your project and use the following import statement:
```{javascript}
import { init } from '@neynar/create-farcaster-mini-app';
```

## 🎯 Funcționalități

- ✅ **Mint NFT-uri** - Mint NFT-uri caritabile pentru Base For Kids
- ✅ **Wallet Integration** - Suport pentru EVM (Base, Optimism, Degen) și Solana
- ✅ **Farcaster Auth** - Autentificare nativă Farcaster
- ✅ **Notifications** - Trimite notificări utilizatorilor
- ✅ **Share** - Share mini app-ul cu alții
- ✅ **Haptic Feedback** - Feedback haptic pentru acțiuni

## 📦 Deployment

### Deploy pe Vercel

```bash
npm run deploy:vercel
```

Sau conectează repository-ul direct în dashboard-ul Vercel pentru deployment automat.

## Building for Production

To create a production build, run:
```{bash}
npm run build
```

The above command will generate a `.env` file based on the `.env.local` file and user input. Be sure to configure those environment variables on your hosting platform.

## Developing Script Locally

This section is only for working on the script and template. If you simply want to create a mini app and _use_ the template, this section is not for you.

### Recommended: Using `npm link` for Local Development

To iterate on the CLI and test changes in a generated app without publishing to npm:

1. In your installer/template repo (this repo), run:
   ```bash
   npm link
   ```
   This makes your local version globally available as a symlinked package.


1. Now, when you run:
   ```bash
   npx @neynar/create-farcaster-mini-app
   ```
   ...it will use your local changes (including any edits to `init.js` or other files) instead of the published npm version.

### Alternative: Running the Script Directly

You can also run the script directly for quick iteration:

```bash
node ./bin/index.js
```

However, this does not fully replicate the npx install flow and may not catch all issues that would occur in a real user environment.

## 🛠️ Development

### Scripts Disponibile

- `npm run dev` - Rulează aplicația în development mode
- `npm run build` - Build pentru producție
- `npm run start` - Rulează build-ul de producție
- `npm run deploy:vercel` - Deploy automat pe Vercel
- `npm run cleanup` - Curăță procesele care folosesc portul

## 📚 Resurse

- [Documentație Neynar](https://docs.neynar.com)
- [Farcaster Developers](https://farcaster.xyz/~/developers)
- [Next.js Docs](https://nextjs.org/docs)
- [Ghid de Setup](./SETUP.md) - Instrucțiuni detaliate în română

## 🤝 Contribuții

Contribuțiile sunt binevenite! Te rugăm să:
1. Fork repository-ul
2. Creează un branch pentru feature-ul tău
3. Commit schimbările
4. Push la branch
5. Deschide un Pull Request

## 📄 Licență

Vezi [LICENSE](./LICENSE) pentru detalii.

