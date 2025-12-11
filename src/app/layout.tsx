// src/app/layout.tsx (Versiune Finală Fără Comentarii)

import type { Metadata } from 'next';
import '~/app/globals.css';
import { Providers } from '~/app/providers';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '~/lib/constants';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/Base-for-kids-cover.png`,
        width: 1200,
        height: 630,
        alt: 'Base For Kids - Mint NFTs, fund gifts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/Base-for-kids-cover.png`],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-slate-100 bg-slate-900 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}