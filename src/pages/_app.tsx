// src/pages/_app.tsx
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { UserProvider } from '@/contexts/UserContext'; 



export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
    </UserProvider>
  );
}
