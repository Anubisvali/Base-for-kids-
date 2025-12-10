# 🚀 Ghid de Deployment pe Vercel - Base For Kids

Acest ghid te va ajuta să publici aplicația ta Farcaster Mini App pe Vercel.

## 📋 Pași de Deployment

### 1. Pregătire Cod

Asigură-te că:
- ✅ Toate modificările sunt commit-ate în Git
- ✅ Aplicația rulează local fără erori (`npm run dev`)
- ✅ Build-ul funcționează (`npm run build`)

### 2. Creare Cont Vercel

1. Mergi la [vercel.com](https://vercel.com)
2. Creează un cont (sau loghează-te) cu GitHub/GitLab/Bitbucket
3. Instalează Vercel CLI (opțional, pentru deployment din terminal):
   ```bash
   npm i -g vercel
   ```

### 3. Deployment prin Vercel Dashboard (Recomandat)

#### Opțiunea A: Conectare GitHub Repository

1. **Push codul pe GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **În Vercel Dashboard:**
   - Apasă "Add New Project"
   - Selectează repository-ul tău
   - Vercel va detecta automat Next.js

3. **Configurează proiectul:**
   - **Framework Preset:** Next.js (detectat automat)
   - **Root Directory:** `./` (sau lăsă gol)
   - **Build Command:** `npm run build` (sau `next build`)
   - **Output Directory:** `.next` (Next.js default)

4. **Adaugă Environment Variables:**
   - Click pe "Environment Variables"
   - Adaugă următoarele variabile:

   **OBLIGATORIU:**
   ```
   NEXT_PUBLIC_URL=https://your-project-name.vercel.app
   ```
   (Vercel va genera automat un URL, dar poți seta unul custom mai târziu)

   **RECOMANDAT (Neynar):**
   ```
   NEYNAR_API_KEY=your_neynar_api_key
   NEYNAR_CLIENT_ID=your_neynar_client_id
   ```

   **OPȚIONAL:**
   ```
   KV_REST_API_URL=your_upstash_redis_url
   KV_REST_API_TOKEN=your_upstash_redis_token
   SOLANA_RPC_ENDPOINT=https://solana-rpc.publicnode.com
   ```

5. **Deploy:**
   - Click "Deploy"
   - Așteaptă build-ul să se finalizeze (2-5 minute)

6. **Actualizează NEXT_PUBLIC_URL:**
   - După primul deploy, Vercel va genera un URL (ex: `https://base-for-kids.vercel.app`)
   - Mergi la Settings → Environment Variables
   - Actualizează `NEXT_PUBLIC_URL` cu URL-ul real generat de Vercel
   - Redeploy (Vercel va redeploy automat după ce actualizezi variabilele)

#### Opțiunea B: Deployment Manual (fără Git)

1. **Instalează Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login în Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Răspunde la întrebări:
     - Set up and deploy? **Yes**
     - Which scope? (selectează contul tău)
     - Link to existing project? **No** (prima dată)
     - Project name? (lăsă default sau alege un nume)
     - Directory? `./`

4. **Adaugă Environment Variables:**
   ```bash
   vercel env add NEXT_PUBLIC_URL
   # Introdu URL-ul generat de Vercel (ex: https://base-for-kids.vercel.app)
   
   vercel env add NEYNAR_API_KEY
   # Introdu cheia ta Neynar API
   
   vercel env add NEYNAR_CLIENT_ID
   # Introdu Client ID-ul tău Neynar
   ```

5. **Deploy Production:**
   ```bash
   vercel --prod
   ```

### 4. Configurare Custom Domain (Opțional)

1. **În Vercel Dashboard:**
   - Mergi la Settings → Domains
   - Adaugă domeniul tău (ex: `base-for-kids.com`)
   - Urmează instrucțiunile pentru a configura DNS-ul

2. **Actualizează NEXT_PUBLIC_URL:**
   - După ce domeniul este configurat, actualizează `NEXT_PUBLIC_URL` cu noul domeniu
   - Redeploy aplicația

### 5. Actualizare Farcaster Manifest

După deployment, trebuie să actualizezi manifestul Farcaster:

1. **Editează `public/.well-known/farcaster.json`:**
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

2. **Commit și push:**
   ```bash
   git add public/.well-known/farcaster.json
   git commit -m "Update Farcaster manifest with production URL"
   git push
   ```

3. **Vercel va redeploy automat** (dacă ai conectat GitHub)

### 6. Verificare Deployment

1. **Verifică URL-ul generat:**
   - Mergi la `https://your-project-name.vercel.app`
   - Aplicația ar trebui să se încarce

2. **Testează în Farcaster Preview:**
   - Mergi la [Farcaster Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview)
   - Introdu URL-ul tău Vercel
   - Apasă "Preview"

3. **Verifică Environment Variables:**
   - În Vercel Dashboard → Settings → Environment Variables
   - Asigură-te că toate variabilele sunt setate corect

## 🔧 Troubleshooting

### Build Fails

**Eroare:** `Module not found` sau `Cannot find module`
- **Soluție:** Verifică că toate dependențele sunt în `package.json`
- Rulează `npm install` local și verifică că nu există erori

**Eroare:** `Environment variable not found`
- **Soluție:** Asigură-te că toate variabilele necesare sunt setate în Vercel Dashboard

### Aplicația nu se încarcă

**Problema:** Blank page sau erori în consolă
- **Soluție:** Verifică că `NEXT_PUBLIC_URL` este setat corect cu URL-ul Vercel
- Verifică logs în Vercel Dashboard → Deployments → [Latest] → Functions

### Farcaster Preview nu funcționează

**Problema:** "Failed to load" sau "Ready not called"
- **Soluție:** 
  - Verifică că `NEXT_PUBLIC_URL` este setat cu URL-ul corect
  - Verifică că manifestul Farcaster (`public/.well-known/farcaster.json`) are URL-urile corecte
  - Verifică că toate asset-urile (icon.png, splash.png) sunt accesibile

## 📝 Checklist Pre-Deployment

- [ ] Codul este commit-at și push-at pe Git
- [ ] Build-ul local funcționează (`npm run build`)
- [ ] Toate environment variables sunt pregătite
- [ ] Manifestul Farcaster este actualizat cu URL-ul de producție
- [ ] Asset-urile (imagini) sunt în folderul `public/`
- [ ] Aplicația rulează fără erori local

## 🎯 Post-Deployment

După deployment:

1. **Testează aplicația:**
   - Verifică că toate tab-urile funcționează
   - Testează mint-ul NFT (dacă ai wallet conectat)
   - Verifică că toate funcționalitățile sunt accesibile

2. **Actualizează documentația:**
   - Actualizează README.md cu URL-ul de producție
   - Actualizează orice link-uri către aplicație

3. **Monitorizează:**
   - Verifică Vercel Dashboard pentru erori
   - Monitorizează logs pentru probleme
   - Verifică analytics (dacă ai configurat)

## 🔗 Link-uri Utile

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Neynar Documentation](https://docs.neynar.com/)

## ✅ Gata!

După ce ai urmat acești pași, aplicația ta ar trebui să fie live pe Vercel și accesibilă prin Farcaster Preview Tool!

**URL-ul tău va fi:** `https://your-project-name.vercel.app`


