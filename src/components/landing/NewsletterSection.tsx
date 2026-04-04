"use client";

import { type FormEvent, useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="container mx-auto px-6 lg:px-12 mt-24 md:mt-40 reveal">
      <div className="bg-white/40 backdrop-blur-[16px] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden">
        {/* Decorative blobs inside card */}
        <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-48 h-48 md:w-64 md:h-64 bg-slate-200 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-stone-200 rounded-full mix-blend-multiply filter blur-[60px] opacity-50" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Dapatkan Rekomendasi Mingguan
          </h2>
          <p className="text-sm md:text-base text-slate-600 mb-8 font-medium">
            Bergabung dengan komunitas kami dan jadilah yang pertama tahu tentang
            rilis buku terbaru, diskon eksklusif, dan artikel inspiratif.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email Anda..."
              required
              className="flex-1 px-5 py-3 md:px-6 md:py-4 rounded-full bg-white/60 backdrop-blur-sm border border-white focus:outline-none focus:ring-2 focus:ring-slate-400 placeholder-slate-400 text-slate-700 text-sm md:text-base shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-900 shadow-lg shadow-slate-300 transition-all whitespace-nowrap text-sm md:text-base"
            >
              Berlangganan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
