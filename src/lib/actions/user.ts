'use server';

import { prisma } from '@/src/lib/prisma';
import { getSession } from '@/src/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { savePublicFile } from '../upload';

import type { UserProfile, UserItem } from '@/src/types/user';

/**
 * Mendapatkan profil lengkap dari current user.
 */
export async function getUserProfile(): Promise<UserProfile> {
  const session = await getSession();
  if (!session?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      bio: true,
      address: true,
      avatarUrl: true,
      paymentPin: true,
      createdAt: true,
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { paymentPin, ...userData } = user;
  return { ...userData, hasPaymentPin: !!paymentPin };
}

/**
 * Memperbarui profil user (Nama, Email, Bio, Address).
 */
export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const fullName = formData.get("fullName")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const bio = formData.get("bio")?.toString()?.trim();
  const address = formData.get("address")?.toString()?.trim();

  if (!fullName || !email) {
    return { success: false, message: "Name and Email are required." };
  }

  try {
    // Pengecekan jika email diubah, memastikan email tidak duplikat dengan user lain
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.id) {
      return { success: false, message: "Email sudah digunakan oleh akun lain." };
    }

    await prisma.user.update({
      where: { id: session.id },
      data: {
        fullName,
        email,
        bio: bio || null,
        address: address || null,
      },
    });

    revalidatePath('/user/settings'); // Revalidate halaman agar langsung terupdate
    return { success: true, message: "Profil berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Gagal memperbarui profil." };
  }
}

/**
 * Mengunggah avatar, baik file upload (.png, .jpg) maupun input url langsung.
 */
export async function updateAvatar(formData: FormData) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const urlInput = formData.get("avatarUrl")?.toString();
  const file = formData.get("avatarFile") as File | null;
  
  try {
    let finalAvatarUrl: string | null = null;
    
    if (file && file.size > 0) {
      // Logic file upload
      const MaxFileSize = 2 * 1024 * 1024; // 2MB
      if (file.size > MaxFileSize) {
        return { success: false, message: "Ukuran file tidak boleh lebih dari 2MB" };
      }
      
      finalAvatarUrl = await savePublicFile(file, 'pfp', session.id);
    } else if (urlInput && urlInput.trim() !== '') {
      // Menggunakan URL direct if no file
      finalAvatarUrl = urlInput.trim();
    }
  
    if (finalAvatarUrl !== null) {
      await prisma.user.update({
        where: { id: session.id },
        data: { avatarUrl: finalAvatarUrl },
      });
      revalidatePath('/user/settings');
      return { success: true, message: "Avatar berhasil diperbarui.", avatarUrl: finalAvatarUrl };
    } else {
      return { success: false, message: "Tidak ada file atau URL yang valid" };
    }
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { success: false, message: "Gagal mengunggah avatar." };
  }
}

/**
 * Memperbarui kata sandi.
 */
export async function updatePassword(formData: FormData) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Semua field harus diisi." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Kata sandi baru tidak cocok dengan konfirmasi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Kata sandi saat ini salah." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedPassword },
    });

    revalidatePath('/user/settings');
    return { success: true, message: "Kata sandi berhasil diperbarui. Silakan login kembali." };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, message: "Gagal memperbarui kata sandi." };
  }
}

/**
 * Mengatur atau memperbarui Payment PIN 6-digit.
 */
export async function updatePaymentPin(formData: FormData) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const currentPin = formData.get("currentPin")?.toString();
  const pin = formData.get("pin")?.toString();
  const confirmPin = formData.get("confirmPin")?.toString();

  if (!pin || !confirmPin) {
    return { success: false, message: "PIN baru dan konfirmasi PIN harus diisi." };
  }

  if (pin !== confirmPin) {
    return { success: false, message: "PIN dan konfirmasi PIN baru tidak cocok." };
  }

  // Validasi PIN hanya angka
  if (!/^\d{6}$/.test(pin)) {
    return { success: false, message: "PIN harus berupa 6 digit angka numerik." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { paymentPin: true }
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.paymentPin) {
      // User sudah memiliki PIN, maka validasi PIN lama
      if (!currentPin) {
        return { success: false, message: "Masukkan PIN saat ini untuk dapat memperbaruinya." };
      }
      
      const isPinValid = await bcrypt.compare(currentPin, user.paymentPin);
      if (!isPinValid) {
        return { success: false, message: "PIN saat ini salah." };
      }
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    
    await prisma.user.update({
      where: { id: session.id },
      data: { paymentPin: hashedPin },
    });

    revalidatePath('/user/settings');
    return { success: true, message: "Payment PIN berhasil diatur." };
  } catch (error) {
    console.error("Error updating payment PIN:", error);
    return { success: false, message: "Gagal mengatur Payment PIN." };
  }
}

/**
 * Memverifikasi Payment PIN. Digunakan sebelum checkout.
 */
export async function verifyPaymentPin(pin: string) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, message: "Unauthorized" };
  }

  if (!pin || !/^\d{6}$/.test(pin)) {
    return { success: false, message: "PIN harus berupa 6 digit angka." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { paymentPin: true },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!user.paymentPin) {
      return { success: false, message: "PIN belum diatur. Silakan atur PIN terlebih dahulu melalui Pengaturan Keamanan." };
    }

    const isValid = await bcrypt.compare(pin, user.paymentPin);
    if (!isValid) {
      return { success: false, message: "Payment PIN salah." };
    }

    return { success: true, message: "PIN Valid." };
  } catch (error) {
    console.error("Error verifying payment PIN:", error);
    return { success: false, message: "Terjadi kesalahan internal server." };
  }
}

/**
 * Admin: Mendapatkan daftar semua user.
 */
export async function getAllUsers(): Promise<UserItem[]> {
  const session = await getSession();
  if (!session?.id || session.role !== 'admin') {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return users;
}

/**
 * Admin: Menghapus user berdasarkan ID.
 */
export async function deleteUser(id: string) {
  const session = await getSession();
  if (!session?.id || session.role !== 'admin') {
    return { success: false, message: "Unauthorized" };
  }

  if (session.id === id) {
    return { success: false, message: "Admin tidak dapat menghapus dirinya sendiri." };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true, message: "Pengguna berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Gagal menghapus pengguna." };
  }
}


/**
 * Admin: Membuat pengguna baru
 */

export async function createUser(data: { fullName: string; email: string; role: string; password?: string }) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== 'admin') {
      return { success: false, message: "Unauthorized" };
    }

    if (!data.fullName || !data.email || !data.role) {
      return { success: false, message: "Nama, Email, dan Peran (Role) wajib diisi." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { success: false, message: "Email ini sudah digunakan oleh pengguna lain." };
    }

    // Default password 'password123' if not provided
    const rawPass = data.password && data.password.trim() !== '' ? data.password : 'password123';
    const hashedPassword = await bcrypt.hash(rawPass, 10);

    await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        password: hashedPassword,
        phone: '', // required by schema, putting empty default
      }
    });

    revalidatePath('/admin/users');
    return { success: true, message: "Pengguna berhasil ditambahkan." };
  } catch (error) {
    console.error('Create User Error:', error);
    return { success: false, message: "Gagal menambahkan pengguna baru." };
  }
}

/**
 * Admin: Mengubah data pengguna yang ada (Name, Email, Role)
 */
export async function updateUser(id: string, data: { fullName: string; email: string; role: string }) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== 'admin') {
      return { success: false, message: "Unauthorized" };
    }

    if (!data.fullName || !data.email || !data.role) {
      return { success: false, message: "Nama, Email, dan Peran (Role) wajib diisi." };
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) return { success: false, message: "Pengguna tidak ditemukan." };

    if (data.email !== targetUser.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        return { success: false, message: "Email ini sudah digunakan oleh akun lain." };
      }
    }

    await prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      }
    });

    revalidatePath('/admin/users');
    return { success: true, message: "Data pengguna berhasil diperbarui." };
  } catch (error) {
    console.error('Update User Error:', error);
    return { success: false, message: "Gagal memperbarui data pengguna." };
  }
}
