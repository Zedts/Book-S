"use client";

import { useState } from "react";
import { User, Bell, Lock, Palette, Save, Shield, LogOut, ChevronRight, Monitor, Moon, Sun, Globe, Mail, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/ui/GlassCard";
import UserLayout from "@/src/components/layout/UserLayout";
import Notification from "@/src/components/ui/Notification";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useNotification } from "@/src/hooks/useNotification";
import { cn } from "@/src/lib/utils";

const TABS = [
  { id: "profile", label: "Profil", icon: User, description: "Atur identitas dan informasi publik" },
  { id: "preferences", label: "Preferensi", icon: Palette, description: "Sesuaikan tampilan dan bahasa" },
  { id: "security", label: "Keamanan", icon: Lock, description: "Ubah kata sandi dan keamanan akun" },
  { id: "notifications", label: "Notifikasi", icon: Bell, description: "Kontrol email dan peringatan push" },
] as const;

interface SaveButtonProps {
  isSaving: boolean;
  label?: string;
  savingLabel?: string;
  disabled?: boolean;
}

function SaveButton({ isSaving, label = "Simpan Perubahan", savingLabel = "Menyimpan...", disabled }: SaveButtonProps) {
  return (
    <Button type="submit" disabled={isSaving || disabled}>
      {isSaving ? (
        <>{savingLabel}</>
      ) : (
        <>
          <Save className="w-4 h-4" />
          {label}
        </>
      )}
    </Button>
  );
}

interface ProfileTabProps {
  form: { fullName: string; email: string; bio: string };
  setForm: React.Dispatch<React.SetStateAction<{ fullName: string; email: string; bio: string }>>;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
}

function ProfileTab({ form, setForm, isSaving, onSave }: ProfileTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Profil Publik</h2>
          <p className="text-sm text-slate-500 font-medium">Informasi ini akan ditampilkan kepada pengguna lain.</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
          <span className="text-3xl font-bold tracking-widest text-slate-700 uppercase">
            {form.fullName.substring(0, 2)}
          </span>
        </div>
        <div className="space-y-2">
          <Button variant="secondary" type="button" className="text-sm px-4 py-2">Ubah Foto</Button>
          <p className="text-xs text-slate-400 font-medium">JPG, GIF atau PNG. Maksimal ukuran 2MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nama Lengkap"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Masukkan nama lengkap"
          icon={<User className="w-5 h-5 text-slate-400" />}
        />
        <Input
          label="Alamat Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Masukkan email"
          icon={<Mail className="w-5 h-5 text-slate-400" />}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
          Bio Singkat
        </label>
        <textarea
          placeholder="Ceritakan sedikit tentang Anda..."
          className="w-full min-h-[120px] p-4 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-400 focus:bg-white transition-all outline-none text-slate-800 font-medium placeholder-slate-400 resize-none"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <SaveButton isSaving={isSaving} />
      </div>
    </form>
  );
}

interface SecurityTabProps {
  form: { current: string; new: string; confirm: string };
  setForm: React.Dispatch<React.SetStateAction<{ current: string; new: string; confirm: string }>>;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
}

function SecurityTab({ form, setForm, isSaving, onSave }: SecurityTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Keamanan Akun</h2>
          <p className="text-sm text-slate-500 font-medium">Lindungi akun Anda dengan kata sandi yang kuat.</p>
        </div>
      </div>

      <div className="space-y-6 max-w-xl">
        <Input
          label="Kata Sandi Saat Ini"
          type="password"
          placeholder="Masukkan kata sandi saat ini"
          icon={<Lock className="w-5 h-5 text-slate-400" />}
          value={form.current}
          onChange={(e) => setForm({ ...form, current: e.target.value })}
        />
        <Input
          label="Kata Sandi Baru"
          type="password"
          placeholder="Tentukan kata sandi baru"
          icon={<Lock className="w-5 h-5 text-slate-400" />}
          value={form.new}
          onChange={(e) => setForm({ ...form, new: e.target.value })}
        />
        <Input
          label="Ulangi Kata Sandi Baru"
          type="password"
          placeholder="Masukkan ulang kata sandi"
          icon={<Shield className="w-5 h-5 text-slate-400" />}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <SaveButton 
          isSaving={isSaving} 
          disabled={!form.new} 
          savingLabel="Memperbarui..." 
        />
      </div>
    </form>
  );
}

type Tab = typeof TABS[number]['id'];

export default function UserSettings() {
  const { user, handleLogout } = useRequireRole("users");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const { 
    isOpen: notificationOpen, 
    message: notificationMessage, 
    type: notificationType,
    showNotification, 
    onClose: hideNotification 
  } = useNotification();

  // Form states 
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: "user@example.com", // Mocked email until real user object provides it
    bio: "Pecinta buku fiksi dan non-fiksi.",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    'notif-1': true,
    'notif-2': true,
    'notif-3': true,
    'notif-4': true,
  });

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      showNotification("Pengaturan berhasil disimpan!", "success");
    }, 1000);
  };

  return (
    <UserLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-slate-700" />
              Pengaturan
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base max-w-2xl">
              Kelola informasi akun, preferensi tampilan, dan tingkatkan keamanan profil Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation for Settings */}
          <div className="lg:col-span-4 space-y-4">
            <GlassCard className="p-2 space-y-1 rounded-3xl">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group",
                      isActive
                        ? "bg-slate-800 text-white shadow-md shadow-slate-200"
                        : "hover:bg-white/60 text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <div className={cn(
                      "p-2.5 rounded-xl transition-colors",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{tab.label}</p>
                      <p className={cn("text-xs", isActive ? "text-slate-300" : "text-slate-400 font-medium")}>
                        {tab.description}
                      </p>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                  </button>
                );
              })}
            </GlassCard>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-6 py-4 rounded-3xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors group font-bold tracking-wide text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl group-hover:scale-110 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                Keluar Akun
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <GlassCard className="p-6 md:p-8 rounded-[2rem] glow min-h-[500px]">
              {activeTab === "profile" && (
                <ProfileTab 
                  form={profileForm} 
                  setForm={setProfileForm} 
                  isSaving={isSaving} 
                  onSave={handleSave} 
                />
              )}

              {activeTab === "preferences" && (
                <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Preferensi</h2>
                      <p className="text-sm text-slate-500 font-medium">Sesuaikan pengalaman Anda menggunakan aplikasi.</p>
                    </div>
                  </div>

                  {/* Tema */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tema Tampilan</h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Segera Hadir</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* System */}
                      <button type="button" disabled className="relative p-1 rounded-2xl ring-2 ring-slate-300 ring-offset-2 opacity-60 cursor-not-allowed">
                        <div className="bg-slate-50 border text-center p-4 rounded-xl space-y-2">
                          <Monitor className="w-6 h-6 mx-auto text-slate-500" />
                          <p className="font-bold text-sm text-slate-500">Sistem</p>
                        </div>
                      </button>
                      <button type="button" disabled className="relative p-1 rounded-2xl border border-transparent opacity-60 cursor-not-allowed">
                        <div className="bg-slate-50 border border-slate-200 text-center p-4 rounded-xl space-y-2">
                          <Sun className="w-6 h-6 mx-auto text-slate-400" />
                          <p className="font-bold text-sm text-slate-400">Terang</p>
                        </div>
                      </button>
                      <button type="button" disabled className="relative p-1 rounded-2xl border border-transparent opacity-60 cursor-not-allowed">
                        <div className="bg-slate-800 border-slate-700 border text-center p-4 rounded-xl space-y-2">
                          <Moon className="w-6 h-6 mx-auto text-slate-500" />
                          <p className="font-bold text-sm text-slate-500">Gelap</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Bahasa */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Bahasa & Wilayah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/60 border border-slate-200 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">Bahasa Indonesia</p>
                            <p className="text-xs text-slate-400 mt-0.5">Bahasa Utama</p>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded-full border-4 border-slate-800 bg-white" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/30 border border-slate-200 flex items-center justify-between cursor-not-allowed opacity-60">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-bold text-sm text-slate-500">English (US)</p>
                            <p className="text-xs text-slate-400 mt-0.5">Segera Hadir</p>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <SaveButton isSaving={isSaving} />
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <SecurityTab 
                  form={passwordForm} 
                  setForm={setPasswordForm} 
                  isSaving={isSaving} 
                  onSave={handleSave} 
                />
              )}

              {activeTab === "notifications" && (
                <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Pemberitahuan</h2>
                      <p className="text-sm text-slate-500 font-medium">Pilih aktivitas mana yang ingin Anda terima.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { id: 'notif-1', title: 'Pembaruan Buku Baru', desc: 'Terima info ketika ada rilis buku terbaru sesuai kategori favorit Anda.', disabled: false },
                      { id: 'notif-2', title: 'Ringkasan Aktivitas Mingguan', desc: 'Dapatkan email terkait statistik membaca dan ulasan.', disabled: false },
                      { id: 'notif-3', title: 'Pemberitahuan Keamanan', desc: 'Diberitahu jika ada login dari perangkat baru atau perubahan kata sandi.', disabled: false },
                      { id: 'notif-4', title: 'Promosi Sistem', desc: 'Informasi tentang diskon atau layanan berbayar baru.', disabled: false },
                    ].map((item) => {
                      const isChecked = notifications[item.id as keyof typeof notifications];
                      return (
                        <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="font-bold text-slate-800 text-sm md:text-base">{item.title}</p>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifications((prev) => ({ ...prev, [item.id]: !isChecked }))}
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200 shrink-0",
                              isChecked ? "bg-slate-800" : "bg-slate-200",
                              item.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={item.disabled}
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                isChecked ? "translate-x-6" : "translate-x-1"
                              )}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>Menyimpan...</>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      <Notification
        isOpen={notificationOpen}
        message={notificationMessage}
        type={notificationType}
        onClose={hideNotification}
      />
    </UserLayout>
  );
}
