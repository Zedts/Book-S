import { BookOpen } from "lucide-react";
import type { FooterColumn } from "@/src/types/landing";

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Jelajahi",
    links: [
      { label: "Beranda", href: "#" },
      { label: "Kategori", href: "#" },
      { label: "Buku Terlaris", href: "#" },
      { label: "Rilisan Baru", href: "#" },
    ],
  },
  {
    heading: "Bantuan",
    links: [
      { label: "Status Pesanan", href: "#" },
      { label: "Pengiriman", href: "#" },
      { label: "Pengembalian", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    heading: "Sosial Media",
    links: [
      { label: "Instagram", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Facebook", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200/50 bg-white/40 backdrop-blur-lg pt-12 md:pt-16 pb-8 reveal">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-10 md:mb-12">
          <BrandColumn />
          {FOOTER_COLUMNS.map((column) => (
            <LinkColumn key={column.heading} column={column} />
          ))}
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}

function BrandColumn() {
  return (
    <div className="col-span-1 sm:col-span-2 md:col-span-1">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-slate-800" />
        <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-800">
          Book&apos;S
        </span>
      </div>
      <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
        Destinasi utama untuk menemukan buku-buku pilihan yang menginspirasi,
        mendidik, dan menghibur.
      </p>
    </div>
  );
}

function LinkColumn({ column }: { column: FooterColumn }) {
  return (
    <div>
      <h4 className="font-bold text-slate-800 mb-4 md:mb-6">{column.heading}</h4>
      <ul className="space-y-3 md:space-y-4 text-sm font-medium text-slate-500">
        {column.links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="hover:text-slate-800 transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="border-t border-slate-300/50 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-semibold text-slate-400">
      <p>&copy; 2026 Book&apos;S. Hak Cipta Dilindungi.</p>
      <div className="flex gap-4 md:gap-6">
        <a href="#" className="hover:text-slate-600 transition-colors">
          Kebijakan Privasi
        </a>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Syarat &amp; Ketentuan
        </a>
      </div>
    </div>
  );
}
