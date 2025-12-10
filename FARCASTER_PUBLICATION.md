# 🚀 Pași pentru Publicarea Mini App pe Farcaster

## 📋 Checklist Pre-Deployment

- [ ] Aplicația rulează local fără erori
- [ ] Build-ul funcționează (`npm run build`)
- [ ] Toate variabilele de mediu sunt configurate
- [ ] Manifestul Farcaster este actualizat cu URL-ul de producție

## 🔧 Pași de Deployment

### 1. Deploy pe Vercel (sau alt hosting)

**Opțiunea A: Vercel Dashboard (Recomandat)**
1. Mergi la [vercel.com](https://vercel.com) și creează cont
2. Push codul pe GitHub:
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```
3. În Vercel Dashboard:
   - Click "Add New Project"
   - Selectează repository-ul
   - Vercel detectează automat Next.js
4. Adaugă Environment Variables:
   - `NEXT_PUBLIC_URL` = URL-ul generat de Vercel (ex: `https://base-for-kids.vercel.app`)
   - `NEYNAR_API_KEY` = cheia ta Neynar (dacă ai)
   - `NEYNAR_CLIENT_ID` = Client ID-ul tău (dacă ai)
5. Click "Deploy"

**Opțiunea B: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel  # Prima dată
vercel --prod  # Pentru producție
```

### 2. Actualizează Manifestul Farcaster

După ce ai URL-ul de producție (ex: `https://base-for-kids.vercel.app`):

1. Editează `public/.well-known/farcaster.json`:
   ```json
   {
     "frame": {
       "homeUrl": "https://your-vercel-url.vercel.app/",
       "iconUrl": "https://your-vercel-url.vercel.app/icon.png",
       "heroImageUrl": "https://your-vercel-url.vercel.app/Base-for-kids-cover.png",
       "splashImageUrl": "https://your-vercel-url.vercel.app/splash.png"
     }
   }
   ```

2. Commit și push:
   ```bash
   git add public/.well-known/farcaster.json
   git commit -m "Update Farcaster manifest with production URL"
   git push
   ```

3. Vercel va redeploy automat (dacă ai conectat GitHub)

### 3. Actualizează Environment Variables în Vercel

1. Mergi la Vercel Dashboard → Settings → Environment Variables
2. Actualizează `NEXT_PUBLIC_URL` cu URL-ul real de producție
3. Vercel va redeploy automat

### 4. Verifică Manifestul

Verifică că manifestul este accesibil:
```
https://your-vercel-url.vercel.app/.well-known/farcaster.json
```

Ar trebui să vezi JSON-ul cu toate datele corecte.

### 5. Submit Mini App pe Farcaster

1. Mergi la [Farcaster Developer Portal](https://farcaster.xyz/~/developers/mini-apps)
2. Click "Submit Mini App" sau "Create Mini App"
3. Completează formularul:
   - **Name**: Base For Kids
   - **URL**: `https://your-vercel-url.vercel.app`
   - **Description**: Every mint funds a Christmas gift for an abandoned child...
   - **Category**: Social / Charity
   - **Tags**: charity, christmas, kids, nft, base
4. Upload assets (icon, hero image, splash) dacă este necesar
5. Submit pentru review

### 6. Testare în Preview

Înainte de submit, testează în [Farcaster Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview):
1. Introdu URL-ul tău Vercel
2. Verifică că toate funcționalitățile funcționează
3. Verifică că nu există erori în consolă

## ✅ Verificări Post-Deployment

- [ ] Aplicația se încarcă corect pe URL-ul de producție
- [ ] Manifestul Farcaster este accesibil
- [ ] Toate asset-urile (imagini) se încarcă corect
- [ ] Butonul de mint funcționează
- [ ] Wallet connection funcționează
- [ ] Bara de progres afișează datele corecte
- [ ] Nu există erori în consolă

## 🔗 Link-uri Utile

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/)
- [Farcaster Developer Portal](https://farcaster.xyz/~/developers/mini-apps)
- [Vercel Documentation](https://vercel.com/docs)
- [Neynar Documentation](https://docs.neynar.com/)

## 📝 Note Importante

1. **HTTPS este obligatoriu** - Vercel oferă HTTPS automat
2. **Manifestul trebuie să fie accesibil** - Verifică că `.well-known/farcaster.json` este public
3. **Asset-urile trebuie să fie accesibile** - Verifică că toate imaginile se încarcă
4. **Environment Variables** - Asigură-te că toate sunt setate corect în Vercel

## 🎯 Gata!

După ce ai urmat acești pași, aplicația ta va fi live și pregătită pentru submit pe Farcaster!


