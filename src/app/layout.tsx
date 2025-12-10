// src/app/layout.tsx (Versiune Finală Fără Comentarii)

import type { Metadata } from 'next';
import '~/app/globals.css';
import { Providers } from '~/app/providers';
import { APP_NAME, APP_DESCRIPTION } from '~/lib/constants';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
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