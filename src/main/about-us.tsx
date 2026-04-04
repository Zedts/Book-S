"use client";

import { Fragment } from "react";
import { GraduationCap, Layout, Code2, Smartphone, BookOpen } from "lucide-react";
import GuestLayout from "@/src/components/layout/GuestLayout";

const FOCUS_CARDS = [
  {
    icon: Layout,
    title: "Desain Antarmuka (UI)",
    description:
      "Menerapkan tren desain modern seperti Glassmorphism untuk menciptakan tampilan visual yang elegan, bersih, dan memanjakan mata pengguna.",
    staggerClass: "stagger-1",
    hasGlow: false,
  },
  {
    icon: Code2,
    title: "Pengembangan Front-End",
    description:
      "Membangun antarmuka menggunakan Next.js 16 dan TailwindCSS v4 untuk arsitektur yang scalable, serta TypeScript untuk menjaga kekokohan tipe data.",
    staggerClass: "stagger-2",
    hasGlow: true,
  },
  {
    icon: Smartphone,
    title: "Desain Responsif",
    description:
      "Memastikan struktur halaman web dapat beradaptasi dan berfungsi dengan sempurna di berbagai ukuran layar, mulai dari HP hingga desktop.",
    staggerClass: "stagger-3",
    hasGlow: false,
  },
];

const STATS = [
  { value: "1", label: "Tugas Proyek Web" },
  { value: "3", label: "Teknologi Utama" },
  { value: "100%", label: "Desain Responsif" },
];

export default function AboutUs() {
  return (
    <GuestLayout>
      <AboutHeroSection />
      <FocusSection />
      <StatsBanner />
    </GuestLayout>
  );
}

function AboutHeroSection() {
  return (
    <section className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 mb-24 md:mb-32">
      {/* Hero text */}
      <div className="lg:w-[50%] flex flex-col items-start on-load-reveal delay-100">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass-card text-[10px] md:text-xs font-bold uppercase tracking-wider mb-5 md:mb-6 text-slate-700 border border-white/60 shadow-sm">
          <GraduationCap className="w-3 h-3 text-slate-800" />
          Proyek Edukasi
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight text-slate-800">
          Tugas Akhir: <br />
          <span className="text-gradient relative inline-block">
            Desain Web
            <svg
              className="absolute w-full h-3 -bottom-1 left-0 text-slate-300/50 -z-10"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,10 Q100,-5 200,10 L200,12 L0,12 Z" />
            </svg>
          </span>
          <br />
          Toko Buku.
        </h1>

        <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed font-medium">
          Book&apos;S adalah sebuah purwarupa (mockup) situs web toko buku modern yang
          dirancang khusus untuk memenuhi tugas sekolah/akademi kami. Proyek ini
          bertujuan untuk mendemonstrasikan pemahaman dalam membangun antarmuka web
          modern yang estetik.
        </p>
        <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
          Dalam pengerjaannya, kami berfokus pada penerapan elemen UI/UX terkini
          seperti gaya visual Glassmorphism, tata letak yang sepenuhnya responsif,
          serta animasi interaktif menggunakan Next.js, TailwindCSS v4, dan TypeScript.
        </p>
      </div>

      {/* Hero visual */}
      <div className="lg:w-[50%] relative w-full flex items-center justify-center on-load-reveal delay-300">
        {/* Glowing orb */}
        <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-slate-300 rounded-full filter blur-[70px] opacity-60" />

        <div className="relative flex items-center justify-center w-full max-w-[400px] md:max-w-[500px]">
          {/* Main image card */}
          <div className="relative w-full aspect-[4/3] bg-white/40 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-white/80 shadow-2xl z-20 animate-float">
            <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-black/10 z-10" />
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800"
                alt="Interior toko buku Book'S"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Decorative badge */}
          <div
            className="absolute -bottom-6 -right-4 md:-right-8 glass-panel px-5 py-4 rounded-2xl flex items-center gap-4 shadow-xl z-30 animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                Konteks
              </p>
              <p className="text-sm md:text-base font-extrabold text-slate-800">
                Tugas Sekolah
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FocusSection() {
  return (
    <section className="container mx-auto px-6 lg:px-12 mt-20 md:mt-32 reveal">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4">
          Fokus Pembelajaran
        </h2>
        <p className="text-sm md:text-base text-slate-600 font-medium">
          Aspek utama yang kami pelajari dan terapkan secara langsung dalam
          pengembangan tugas proyek web ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {FOCUS_CARDS.map((card) => (
          <FocusCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}

type FocusCard = (typeof FOCUS_CARDS)[number];

function FocusCard({ card }: { card: FocusCard }) {
  const Icon = card.icon;

  return (
    <div
      className={`glass-card p-8 rounded-3xl border border-white/60 hover:-translate-y-2 transition-transform duration-300 reveal ${card.staggerClass} relative overflow-hidden`}
    >
      {card.hasGlow && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-200 rounded-full blur-[40px] opacity-50 z-0" />
      )}

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center mb-6">
          <Icon className="w-7 h-7 text-slate-800" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
      </div>
    </div>
  );
}

function StatsBanner() {
  return (
    <section className="container mx-auto px-6 lg:px-12 mt-24 md:mt-32 reveal">
      <div className="glass-panel rounded-[2rem] p-10 md:p-14 border border-white/70 shadow-xl flex flex-wrap md:flex-nowrap items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40" />

        {STATS.map((stat, index) => (
          <Fragment key={stat.label}>
            <div className="w-full md:w-auto relative z-10 flex-1 text-center">
              <p className="text-4xl md:text-5xl font-black text-slate-800 mb-2">{stat.value}</p>
              <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>

            {index < STATS.length - 1 && (
              <div className="hidden md:block w-px h-16 bg-slate-300/50" />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}