#!/usr/bin/env node

/**
 * Script pentru a descărca, procesa și re-încărca metadatele NFT de pe Thirdweb/IPFS
 * 
 * Acest script:
 * 1. Citește tokenURI-urile din contract (sau dintr-un fișier)
 * 2. Descarcă metadatele de pe IPFS
 * 3. Șterge extensia ".jpg" din câmpul "name"
 * 4. Re-încarce metadatele pe IPFS (opțional, dacă ai Thirdweb Secret Key)
 * 5. Salvează metadatele procesate local
 * 
 * Utilizare:
 * 
 * 1. Descarcă și procesează metadatele (fără re-încărcare):
 *    node scripts/fix-thirdweb-metadata.cjs --contract 0xC4261E58085962D15c5628F39C653D33c1d585cF --output ./metadata-fixed
 * 
 * 2. Cu Thirdweb Secret Key (re-încarcă automat):
 *    node scripts/fix-thirdweb-metadata.cjs --contract 0xC4261E58085962D15c5628F39C653D33c1d585cF --thirdweb-secret YOUR_SECRET_KEY --output ./metadata-fixed
 * 
 * 3. Din fișier cu URL-uri:
 *    node scripts/fix-thirdweb-metadata.cjs --urls-file urls.txt --output ./metadata-fixed
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Funcție pentru a șterge extensia .jpg din nume
function removeJpgExtension(name) {
  if (!name || typeof name !== 'string') return name;
  return name.replace(/\.(jpg|jpeg)$/i, '').trim();
}

// Funcție pentru a procesa un obiect de metadate
function processMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    return metadata;
  }

  const processed = { ...metadata };

  // Procesează câmpul "name"
  if (processed.name) {
    processed.name = removeJpgExtension(processed.name);
  }

  return processed;
}

// Funcție pentru a descărca metadate de la un URL
function downloadMetadata(url) {
  return new Promise((resolve, reject) => {
    // Normalizează URL-ul IPFS
    const normalizedUrl = url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
    const protocol = normalizedUrl.startsWith('https') ? https : http;
    
    protocol.get(normalizedUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const metadata = JSON.parse(data);
          resolve(metadata);
        } catch (error) {
          reject(new Error(`Failed to parse JSON from ${url}: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to download ${url}: ${error.message}`));
    });
  });
}

// Funcție pentru a obține tokenURI-urile din contract (folosind public RPC)
async function getTokenURIsFromContract(contractAddress, totalSupply) {
  console.log(`📡 Fetching tokenURI-urile din contract ${contractAddress}...`);
  console.log(`   (Această funcție necesită implementare cu viem/wagmi sau ethers.js)`);
  console.log(`   Pentru moment, folosește --urls-file cu tokenURI-urile manuale`);
  
  // TODO: Implementare cu viem sau ethers.js pentru a citi tokenURI din contract
  // Exemplu cu ethers.js:
  // const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  // const contract = new ethers.Contract(contractAddress, ABI, provider);
  // const uris = [];
  // for (let i = 1; i <= totalSupply; i++) {
  //   const uri = await contract.tokenURI(i);
  //   uris.push({ tokenId: i, uri });
  // }
  // return uris;
  
  return [];
}

// Funcție pentru a încărca metadate pe IPFS folosind Thirdweb Storage
function uploadToIPFS(metadata, thirdwebSecret) {
  return new Promise((resolve, reject) => {
    if (!thirdwebSecret) {
      console.log('⚠️  Thirdweb Secret Key nu este furnizat. Metadatele nu vor fi re-încărcate.');
      resolve(null);
      return;
    }

    const data = JSON.stringify(metadata);
    const options = {
      hostname: 'api.thirdweb.com',
      path: '/v1/ipfs/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'x-secret-key': thirdwebSecret,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`Thirdweb API error: ${res.statusCode} ${res.statusMessage}`));
            return;
          }

          const result = JSON.parse(responseData);
          resolve(result.IpfsHash ? `ipfs://${result.IpfsHash}` : null);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(data);
    req.end();
  });
}

// Funcție principală pentru procesarea metadatelor
async function processMetadataFromURIs(uris, outputDir, thirdwebSecret = null) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }

  console.log(`📦 Processing ${uris.length} metadata files...`);
  console.log('');

  let successCount = 0;
  let changedCount = 0;
  const results = [];

  for (let i = 0; i < uris.length; i++) {
    const { tokenId, uri, originalUri } = uris[i];
    const fileName = `metadata-${tokenId || i + 1}.json`;
    const outputPath = path.join(outputDir, fileName);

    try {
      console.log(`📥 [${i + 1}/${uris.length}] Downloading: ${uri}`);
      const metadata = await downloadMetadata(uri);
      const processed = processMetadata(metadata);
      
      // Salvează local
      fs.writeFileSync(outputPath, JSON.stringify(processed, null, 2), 'utf8');
      
      const nameChanged = metadata.name !== processed.name;
      if (nameChanged) {
        console.log(`  ✅ Fixed: "${metadata.name}" → "${processed.name}"`);
        changedCount++;
      } else {
        console.log(`  ℹ️  No changes needed`);
      }
      
      // Re-încarcă pe IPFS dacă ai Thirdweb Secret Key
      let newUri = uri;
      if (thirdwebSecret) {
        console.log(`  📤 Uploading to IPFS...`);
        newUri = await uploadToIPFS(processed, thirdwebSecret);
        if (newUri) {
          console.log(`  ✅ New IPFS URI: ${newUri}`);
        }
      }
      
      results.push({
        tokenId: tokenId || i + 1,
        originalUri: originalUri || uri,
        newUri,
        changed: nameChanged,
      });
      
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({
        tokenId: tokenId || i + 1,
        originalUri: originalUri || uri,
        newUri: null,
        error: error.message,
      });
    }
    
    // Pauză mică între request-uri
    if (i < uris.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Salvează raportul
  const reportPath = path.join(outputDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    total: uris.length,
    success: successCount,
    changed: changedCount,
    results,
  }, null, 2), 'utf8');

  console.log('');
  console.log(`✅ Processed ${successCount}/${uris.length} files`);
  console.log(`📝 Changed ${changedCount} files`);
  console.log(`📄 Report saved to: ${reportPath}`);
  
  if (thirdwebSecret) {
    console.log('');
    console.log('⚠️  IMPORTANT: După re-încărcare, trebuie să actualizezi tokenURI-urile în contract!');
    console.log('   Folosește funcția setTokenURI() sau updateBatchTokenURI() din Thirdweb Dashboard.');
  }
}

// Funcție pentru a citi URL-uri dintr-un fișier
function readURIsFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  return lines.map((line, index) => {
    // Format: tokenId,uri sau doar uri
    const parts = line.split(',');
    if (parts.length === 2) {
      return { tokenId: parseInt(parts[0]), uri: parts[1], originalUri: parts[1] };
    }
    return { tokenId: index + 1, uri: line, originalUri: line };
  });
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  // --urls-file: procesează URL-uri dintr-un fișier
  const urlsFileIndex = args.indexOf('--urls-file');
  if (urlsFileIndex !== -1 && args[urlsFileIndex + 1]) {
    const urlsFilePath = args[urlsFileIndex + 1];
    const outputDir = args.indexOf('--output') !== -1 && args[args.indexOf('--output') + 1] 
      ? args[args.indexOf('--output') + 1] 
      : './metadata-fixed';
    const thirdwebSecret = args.indexOf('--thirdweb-secret') !== -1 
      ? args[args.indexOf('--thirdweb-secret') + 1] 
      : null;
    
    const uris = readURIsFromFile(urlsFilePath);
    await processMetadataFromURIs(uris, outputDir, thirdwebSecret);
    return;
  }

  // --contract: procesează din contract (necesită implementare)
  const contractIndex = args.indexOf('--contract');
  if (contractIndex !== -1 && args[contractIndex + 1]) {
    const contractAddress = args[contractIndex + 1];
    const totalSupply = args.indexOf('--total-supply') !== -1 
      ? parseInt(args[args.indexOf('--total-supply') + 1]) 
      : null;
    const outputDir = args.indexOf('--output') !== -1 && args[args.indexOf('--output') + 1] 
      ? args[args.indexOf('--output') + 1] 
      : './metadata-fixed';
    const thirdwebSecret = args.indexOf('--thirdweb-secret') !== -1 
      ? args[args.indexOf('--thirdweb-secret') + 1] 
      : null;
    
    if (!totalSupply) {
      console.error('❌ --total-supply este necesar când folosești --contract');
      console.log('   Exemplu: --contract 0x... --total-supply 10000');
      return;
    }
    
    const uris = await getTokenURIsFromContract(contractAddress, totalSupply);
    if (uris.length === 0) {
      console.log('');
      console.log('💡 Sfat: Creează un fișier urls.txt cu tokenURI-urile:');
      console.log('   1,ipfs://QmXXX...');
      console.log('   2,ipfs://QmYYY...');
      console.log('   ...');
      console.log('   Apoi rulează: node scripts/fix-thirdweb-metadata.cjs --urls-file urls.txt');
      return;
    }
    
    await processMetadataFromURIs(uris, outputDir, thirdwebSecret);
    return;
  }

  // Help
  console.log(`
📝 Script pentru procesarea metadatelor NFT de pe Thirdweb/IPFS

Utilizare:

1. Din fișier cu tokenURI-uri (RECOMANDAT):
   node scripts/fix-thirdweb-metadata.cjs --urls-file urls.txt --output ./metadata-fixed

   Formatul urls.txt:
   1,ipfs://QmXXX...
   2,ipfs://QmYYY...
   sau doar:
   ipfs://QmXXX...
   ipfs://QmYYY...

2. Cu re-încărcare pe IPFS (necesită Thirdweb Secret Key):
   node scripts/fix-thirdweb-metadata.cjs --urls-file urls.txt --thirdweb-secret YOUR_SECRET_KEY --output ./metadata-fixed

3. Din contract (necesită implementare cu viem/ethers):
   node scripts/fix-thirdweb-metadata.cjs --contract 0x... --total-supply 10000 --output ./metadata-fixed

Cum să obții tokenURI-urile:

1. Din Thirdweb Dashboard:
   - Mergi la contractul tău
   - Exportă tokenURI-urile sau copiază-le manual

2. Din Basescan:
   - Mergi la contract: https://basescan.org/address/YOUR_CONTRACT
   - Apelează tokenURI(1), tokenURI(2), etc. în "Read Contract"
   - Copiază rezultatele într-un fișier urls.txt

3. Din script (necesită implementare):
   - Scriptul poate citi automat din contract (TODO)

După procesare:
- Metadatele procesate vor fi în directorul de output
- Un raport report.json va conține toate detaliile
- Dacă ai folosit --thirdweb-secret, metadatele vor fi re-încărcate pe IPFS
- Trebuie să actualizezi tokenURI-urile în contract manual sau prin Thirdweb Dashboard
`);
}

main().catch(console.error);

