// src/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";

// Încărcăm componenta de Mini App care conține logica de tab-uri (Header, Footer, HomeTab, WalletTab)
// Această componentă este localizată în 'src/components/App.tsx'
const AppComponent = dynamic(() => import("~/components/App"), {
  ssr: false,
});

export default function Page() {
  return <AppComponent title={APP_NAME} />;
}