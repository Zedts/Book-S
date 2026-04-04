"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { User, LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/ui/GlassCard";

export default function UserHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        if (!userRes.user) {
          window.location.href = '/auth';
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', userRes.user.id)
          .single();

        if (userData?.role === 'admin') {}

        setLoading(false);
      } catch {
        window.location.href = '/auth';
      }
    };

    checkAccess();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background styling elements reminiscent of existing design */}
      <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-slate-200/50 mix-blend-multiply filter blur-[80px] sm:blur-[120px] opacity-60 animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] sm:bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-300/40 mix-blend-multiply filter blur-[80px] sm:blur-[120px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />

      <main className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
        <GlassCard as="header" className="flex flex-wrap gap-4 items-center justify-between mb-12 p-6 rounded-3xl border-white/80 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Hello Users</h1>
              <p className="text-slate-500 font-medium text-sm">Dashboard Pengguna</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="primary"
            className="shadow-[0_8px_20px_-10px_rgba(30,41,59,0.5)]"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </GlassCard>

        <GlassCard as="section" className="rounded-[2rem] p-10 min-h-[60vh] flex items-center justify-center text-center shadow-xl border-white/80">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Mulai Jelajahi</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Ini adalah beranda pembeli. Admin memiliki akses penuh ke halaman ini, namun Anda sebagai &quot;users&quot; hanya bisa melihat halaman ini dan dilarang mengakses halaman admin.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
