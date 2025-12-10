# Template Variabile de Mediu

Copiază acest conținut într-un fișier `.env.local` în root-ul proiectului.

```env
# Farcaster Mini App - Environment Variables

# ============================================
# CONFIGURARE OBLIGATORIE
# ============================================

# URL-ul public al aplicației tale (necesar pentru manifest și share)
# Pentru development local: http://localhost:3000
# Pentru producție: https://your-domain.com
NEXT_PUBLIC_URL=http://localhost:3000

# ============================================
# NEYNAR API (Recomandat)
# ============================================
# Obține cheia API de la: https://neynar.com
# Necesar pentru:
# - Fetch user data
# - Send notifications
# - Webhook events
NEYNAR_API_KEY=your_neynar_api_key_here
NEYNAR_CLIENT_ID=your_neynar_client_id_here

# ============================================
# UPSTASH REDIS (Opțional - pentru notifications)
# ============================================
# Obține credențialele de la: https://upstash.com
# Necesar doar dacă vrei să folosești funcționalitatea de notificări
KV_REST_API_URL=https://your-redis-instance.upstash.io
KV_REST_API_TOKEN=your_redis_token_here

# ============================================
# SOLANA RPC (Opțional)
# ============================================
# Endpoint RPC pentru Solana (default: public node)
SOLANA_RPC_ENDPOINT=https://solana-rpc.publicnode.com

# ============================================
# AUTHENTICATION (Opțional - pentru signer sponsorship)
# ============================================
# Seed phrase pentru signer (doar dacă vrei să sponsorizezi signer-ul)
# ATENȚIE: Nu partaja niciodată seed phrase-ul în producție!
SEED_PHRASE=your_seed_phrase_here
SPONSOR_SIGNER=false

# ============================================
# VERCEL (Opțional - pentru deployment)
# ============================================
# Token pentru deployment automat pe Vercel
VERCEL_TOKEN=your_vercel_token_here

# ============================================
# NEXT AUTH (Opțional)
# ============================================
# Secret pentru NextAuth (generat automat dacă nu e setat)
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Instrucțiuni

1. Creează un fișier `.env.local` în root-ul proiectului
2. Copiază conținutul de mai sus în fișier
3. Completează valorile cu datele tale reale
4. **IMPORTANT:** Nu comita niciodată `.env.local` în git!

## Variabile Obligatorii

- `NEXT_PUBLIC_URL` - Trebuie setat pentru ca aplicația să funcționeze

## Variabile Recomandate

- `NEYNAR_API_KEY` - Pentru funcționalități avansate
- `NEYNAR_CLIENT_ID` - Pentru webhook-uri și notifications

## Variabile Opționale

- `KV_REST_API_URL` și `KV_REST_API_TOKEN` - Doar dacă folosești notificări persistente
- `SOLANA_RPC_ENDPOINT` - Doar dacă folosești Solana
- `SEED_PHRASE` și `SPONSOR_SIGNER` - Doar dacă vrei să sponsorizezi signer-ul
- `VERCEL_TOKEN` - Doar pentru deployment automat
- `NEXTAUTH_SECRET` - Generat automat dacă nu e setat

