/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Save, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Monitor, 
  Moon, 
  Sun, 
  Globe, 
  Mail, 
  Settings as SettingsIcon, 
  Link as LinkIcon, 
  AlertTriangle, 
  MapPin 
} from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/ui/GlassCard";
import Notification from "@/src/components/ui/Notification";
import Modal from "@/src/components/ui/Modal";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useNotification } from "@/src/hooks/useNotification";
import { cn } from "@/src/lib/utils";
import { getUserProfile, updateProfile, updateAvatar, updatePassword, updatePaymentPin } from "@/src/lib/actions/user";

const TABS = [
  { id: "profile", label: "Profil", icon: User, description: "Atur identitas dan informasi publik" },
  { id: "preferences", label: "Preferensi", icon: Palette, description: "Sesuaikan tampilan dan bahasa" },
  { id: "security", label: "Keamanan", icon: Lock, description: "Ubah kata sandi dan keamanan akun" },
  { id: "notifications", label: "Notifikasi", icon: Bell, description: "Kontrol email dan peringatan push" },
] as const;

type Tab = typeof TABS[number]['id'];

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

interface ProfileFormState {
  fullName: string;
  email: string;
  bio: string;
  address: string;
  avatarUrl: string;
}

interface ProfileTabProps {
  form: ProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<ProfileFormState>>;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
  showNotification: (msg: string, type: "success" | "error") => void;
}

function ProfileTab({ form, setForm, isSaving, onSave, showNotification }: ProfileTabProps) {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isEmailLocked, setIsEmailLocked] = useState(true);
  const [isEmailWarningOpen, setIsEmailWarningOpen] = useState(false);

  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingAvatar(true);
    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      } else if (avatarUrlInput) {
        formData.append("avatarUrl", avatarUrlInput);
      }

      const res = await updateAvatar(formData);
      if (res.success && res.avatarUrl) {
        setForm(prev => ({ ...prev, avatarUrl: res.avatarUrl || prev.avatarUrl }));
        showNotification("Avatar berhasil diperbarui", "success");
        setIsAvatarModalOpen(false);
        setAvatarFile(null);
        setAvatarUrlInput("");
      } else {
        showNotification(res.message || "Gagal memperbarui avatar", "error");
      }
    } catch {
      showNotification("Terjadi kesalahan saat memperbarui avatar", "error");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

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
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold tracking-widest text-slate-700 uppercase">
              {(form.fullName || "US").substring(0, 2)}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Button variant="secondary" type="button" className="text-sm px-4 py-2" onClick={() => setIsAvatarModalOpen(true)}>Ubah Foto</Button>
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
        <div className="space-y-1.5 border-none p-0 bg-transparent relative">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Alamat Email</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="email"
                disabled={isEmailLocked}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Masukkan email"
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed outline-none text-slate-800 font-medium"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (isEmailLocked) setIsEmailWarningOpen(true);
                else setIsEmailLocked(true);
              }}
            >
              {isEmailLocked ? "Ubah" : "Kunci"}
            </Button>
          </div>
        </div>
      </div>

      <Input
        label="Alamat Lengkap"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="Masukkan alamat lengkap..."
        icon={<MapPin className="w-5 h-5 text-slate-400" />}
      />

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

      <Modal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} title="Ubah Foto Profil">
        <div className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">URL Foto</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={avatarUrlInput}
                onChange={(e) => setAvatarUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 outline-none text-slate-800 font-medium"
              />
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 font-bold uppercase">Atau</div>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Unggah File</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="w-full p-3 bg-white/60 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsAvatarModalOpen(false)}>Batal</Button>
            <Button type="button" onClick={handleAvatarSubmit} disabled={isUpdatingAvatar}>{isUpdatingAvatar ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEmailWarningOpen} onClose={() => setIsEmailWarningOpen(false)} title="Peringatan Keamanan">
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-800 rounded-xl">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">Mengubah alamat email akan mempengaruhi cara Anda masuk ke dalam akun dan menerima pemberitahuan penting. Apakah Anda yakin ingin melanjutkannya?</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsEmailWarningOpen(false)}>Batal</Button>
            <Button type="button" onClick={() => { setIsEmailLocked(false); setIsEmailWarningOpen(false); }}>Ya, Lanjutkan</Button>
          </div>
        </div>
      </Modal>
    </form>
  );
}

interface SecurityTabProps {
  passwordForm: { current: string; new: string; confirm: string };
  setPasswordForm: React.Dispatch<React.SetStateAction<{ current: string; new: string; confirm: string }>>;
  isSavingPassword: boolean;
  onSavePassword: (e: React.FormEvent) => void;

  pinForm: { current: string; new: string; confirm: string };
  setPinForm: React.Dispatch<React.SetStateAction<{ current: string; new: string; confirm: string }>>;
  isSavingPin: boolean;
  onSavePin: (e: React.FormEvent) => void;
  hasPin: boolean;
}

function SecurityTab({ passwordForm, setPasswordForm, isSavingPassword, onSavePassword, pinForm, setPinForm, isSavingPin, onSavePin, hasPin }: SecurityTabProps) {
  return (
    <div className="space-y-12 animate-fade-in">
      <form onSubmit={onSavePassword} className="space-y-8">
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
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
          />
          <Input
            label="Kata Sandi Baru"
            type="password"
            placeholder="Tentukan kata sandi baru"
            icon={<Lock className="w-5 h-5 text-slate-400" />}
            value={passwordForm.new}
            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
          />
          <Input
            label="Ulangi Kata Sandi Baru"
            type="password"
            placeholder="Masukkan ulang kata sandi"
            icon={<Shield className="w-5 h-5 text-slate-400" />}
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <SaveButton 
            isSaving={isSavingPassword} 
            disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm} 
            savingLabel="Memperbarui..." 
          />
        </div>
      </form>

      <form onSubmit={onSavePin} className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Payment PIN</h2>
            <p className="text-sm text-slate-500 font-medium">Gunakan PIN 6 digit untuk keamanan transaksi Anda.</p>
          </div>
        </div>

        <div className="space-y-6 max-w-xl">
          {hasPin && (
            <Input
              label="PIN Saat Ini"
              type="password"
              inputMode="numeric"
              maxLength={6}
              pattern="\d{6}"
              placeholder="Masukkan 6 digit PIN saat ini"
              icon={<Shield className="w-5 h-5 text-slate-400" />}
              value={pinForm.current}
              onChange={(e) => setPinForm({ ...pinForm, current: e.target.value.replace(/\D/g, '') })}
            />
          )}
          <Input
            label={hasPin ? "PIN Baru" : "PIN Pembayaran"}
            type="password"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            placeholder="Masukkan 6 digit PIN"
            icon={<Shield className="w-5 h-5 text-slate-400" />}
            value={pinForm.new}
            onChange={(e) => setPinForm({ ...pinForm, new: e.target.value.replace(/\D/g, '') })}
          />
          <Input
            label="Ulangi PIN Baru"
            type="password"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            placeholder="Ketik ulang 6 digit PIN"
            icon={<Shield className="w-5 h-5 text-slate-400" />}
            value={pinForm.confirm}
            onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value.replace(/\D/g, '') })}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <SaveButton 
            isSaving={isSavingPin} 
            disabled={hasPin ? (!pinForm.current || !pinForm.new || !pinForm.confirm) : (!pinForm.new || !pinForm.confirm)} 
            savingLabel="Menyimpan PIN..." 
          />
        </div>
      </form>
    </div>
  );
}

interface SettingsViewProps {
  requiredRole: 'admin' | 'users';
  Layout: React.ComponentType<{ children: React.ReactNode }>;
}

export default function SettingsView({ requiredRole, Layout }: SettingsViewProps) {
  const { user, handleLogout } = useRequireRole(requiredRole);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const { 
    isOpen: notificationOpen, 
    message: notificationMessage, 
    type: notificationType,
    showNotification, 
    onClose: hideNotification 
  } = useNotification();

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    fullName: "",
    email: "",
    bio: "",
    address: "",
    avatarUrl: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [pinForm, setPinForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isSavingPin, setIsSavingPin] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  const [notifications, setNotifications] = useState({
    'notif-1': true,
    'notif-2': true,
    'notif-3': true,
    'notif-4': true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const userProfile = await getUserProfile();
        setHasPin(userProfile.hasPaymentPin || false);
        setProfileForm({
          fullName: userProfile.fullName || "",
          email: userProfile.email || "",
          bio: userProfile.bio || "",
          address: userProfile.address || "",
          avatarUrl: userProfile.avatarUrl || "",
        });
      } catch {
        showNotification("Gagal memuat data profil", "error");
      }
    }
    if (user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("fullName", profileForm.fullName);
    formData.append("email", profileForm.email);
    formData.append("bio", profileForm.bio);
    formData.append("address", profileForm.address);

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        showNotification("Profil berhasil diperbarui!", "success");
      } else {
        showNotification(res.message || "Gagal memperbarui profil", "error");
      }
    } catch {
      showNotification("Terjadi kesalahan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showNotification("Kata sandi baru tidak cocok", "error");
      return;
    }
    setIsSaving(true);
    const formData = new FormData();
    formData.append('currentPassword', passwordForm.current);
    formData.append('newPassword', passwordForm.new);
    formData.append('confirmPassword', passwordForm.confirm);

    try {
      const res = await updatePassword(formData);
      if (res.success) {
        showNotification("Kata sandi berhasil diperbarui!", "success");
        setPasswordForm({ current: "", new: "", confirm: "" });
      } else {
        showNotification(res.message || "Gagal memperbarui kata sandi", "error");
      }
    } catch {
      showNotification("Terjadi kesalahan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinForm.new)) {
      showNotification("PIN harus terdiri dari 6 digit angka", "error");
      return;
    }
    if (pinForm.new !== pinForm.confirm) {
      showNotification("PIN tidak cocok", "error");
      return;
    }
    setIsSavingPin(true);
    const formData = new FormData();
    if (pinForm.current) formData.append('currentPin', pinForm.current);
    formData.append('pin', pinForm.new);
    formData.append('confirmPin', pinForm.confirm);

    try {
      const res = await updatePaymentPin(formData);
      if (res.success) {
        showNotification("PIN berhasil diperbarui!", "success");
        setPinForm({ current: "", new: "", confirm: "" });
        setHasPin(true);
      } else {
        showNotification(res.message || "Gagal memperbarui PIN", "error");
      }
    } catch {
      showNotification("Terjadi kesalahan", "error");
    } finally {
      setIsSavingPin(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showNotification("Preferensi berhasil disimpan!", "success");
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in pb-12">
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

          <div className="lg:col-span-8">
            <GlassCard className="p-6 md:p-8 rounded-[2rem] glow min-h-[500px]">
              {activeTab === "profile" && (
                <ProfileTab 
                  form={profileForm} 
                  setForm={setProfileForm} 
                  isSaving={isSaving} 
                  onSave={handleSaveProfile} 
                  showNotification={showNotification}
                />
              )}

              {activeTab === "preferences" && (
                <form onSubmit={handleSaveNotifications} className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Preferensi</h2>
                      <p className="text-sm text-slate-500 font-medium">Sesuaikan pengalaman Anda menggunakan aplikasi.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tema Tampilan</h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Segera Hadir</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  passwordForm={passwordForm} 
                  setPasswordForm={setPasswordForm} 
                  isSavingPassword={isSaving} 
                  onSavePassword={handleSavePassword}
                  pinForm={pinForm}
                  setPinForm={setPinForm}
                  isSavingPin={isSavingPin}
                  onSavePin={handleSavePin}
                  hasPin={hasPin}
                />
              )}

              {activeTab === "notifications" && (
                <form onSubmit={handleSaveNotifications} className="space-y-8 animate-fade-in">
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
    </Layout>
  );
}
