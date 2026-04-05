"use client";

import { Lock, Mail, ArrowRight, LibraryBig, Eye, EyeOff, User, Phone } from "lucide-react";
import GuestLayout from "@/src/components/layout/GuestLayout";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/ui/GlassCard";
import { useAuthForm } from "@/src/hooks/useAuthForm";

export default function Auth() {
  const {
    isLogin,
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    phone,
    setPhone,
    error,
    loading,
    handleSubmit,
    toggleMode
  } = useAuthForm();

  return (
    <GuestLayout>
      <section className="container mx-auto px-6 lg:px-12 flex items-center justify-center min-h-[70vh] py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 on-load-reveal">
            <GlassCard className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-sm border-white/60">
              <LibraryBig className="w-8 h-8 text-slate-800" />
            </GlassCard>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
              {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
            </h1>
            <p className="text-slate-600 font-medium">
              {isLogin
                ? "Masuk ke akun Anda untuk melanjutkan."
                : "Daftar untuk menikmati akses eksklusif fitur kami."}
            </p>
          </div>

          <GlassCard className="p-8 md:p-10 rounded-[2rem] border-white/70 shadow-xl reveal delay-100" glow>
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
              {error && (
                <div className="bg-red-50/50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                  <span className="shrink-0">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {!isLogin && (
                <>
                  <Input
                    label="Nama Lengkap"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    icon={<User className="h-5 w-5 text-slate-400" />}
                  />

                  <Input
                    label="Nomor Telepon"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    icon={<Phone className="h-5 w-5 text-slate-400" />}
                  />
                </>
              )}

              <Input
                label="Alamat Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                icon={<Mail className="h-5 w-5 text-slate-400" />}
              />

              <Input
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                icon={<Lock className="h-5 w-5 text-slate-400" />}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              />

              <Button
                type="submit"
                disabled={loading}
                className="mt-3"
                fullWidth
              >
                {loading ? (
                  "Memproses..."
                ) : (
                  <>
                    {isLogin ? "Masuk Sekarang" : "Daftar Akun"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-slate-600 font-medium hover:text-slate-900 transition-colors text-sm cursor-pointer"
                >
                  {isLogin
                    ? "Belum punya akun? Daftar gratis"
                    : "Sudah punya akun? Masuk di sini"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </section>
    </GuestLayout>
  );
}
