"use client";

import { useScrollReveal } from "@/src/hooks/useScrollReveal";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  useScrollReveal();

  return (
    <>
      {/* Animated glassmorphism background blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 -left-20 w-72 h-72 md:w-[450px] md:h-[450px] bg-stone-200 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-70 animate-blob" />
        <div className="absolute top-20 -right-10 w-72 h-72 md:w-[400px] md:h-[400px] bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 md:w-[400px] md:h-[400px] bg-neutral-200 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-60 animate-blob animation-delay-4000" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-28 md:pt-36 pb-20">
        {children}
      </main>

      <Footer />
    </>
  );
}