'use server';

import { prisma } from '@/src/lib/prisma';
import { signToken, clearSession, getSession, setSession } from '@/src/lib/auth';
import bcrypt from 'bcryptjs';

const CAPTCHA_SECRET = "6LcCMKksAAAAAKwzYV-1tA1EMbmODxnx83-ipO-B";

async function verifyCaptcha(token: string | null): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${CAPTCHA_SECRET}&response=${token}`,
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
    return false;
  }
}

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const captchaToken = formData.get('captchaToken') as string;

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return { error: 'Verifikasi captcha gagal. Silakan coba lagi.' };
    }

    if (!email || !password) {
      return { error: 'Email dan password wajib diisi.' };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: 'Email atau password salah.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: 'Email atau password salah.' };
    }

    // Sign JWT
    const token = await signToken({
      id: user.id,
      role: user.role,
      fullName: user.fullName,
    });

    await setSession(token);

    return { success: true, role: user.role };
  } catch (error) {
    console.error('Login action error:', error);
    return { error: 'Terjadi kesalahan sistem saat login.' };
  }
}

export async function registerAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const captchaToken = formData.get('captchaToken') as string;

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return { error: 'Verifikasi captcha gagal. Silakan coba lagi.' };
    }

    if (!email || !password || !fullName || !phone) {
      return { error: 'Semua field (Email, Password, Nama, Telepon) wajib diisi.' };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Wah, sepertinya email ini sudah terdaftar. Silakan menuju panel "Masuk".' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: 'users',
      },
    });

    // Auto login after success
    const token = await signToken({
      id: newUser.id,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    await setSession(token);

    return { success: true, role: newUser.role };
  } catch (error) {
    console.error('Register action error:', error);
    return { error: 'Terjadi kesalahan sistem saat pendaftaran.' };
  }
}

export async function logoutAction() {
  await clearSession();
  return { success: true };
}

export async function getSessionAction() {
  try {
    const session = await getSession();
    return session;
  } catch {
    return null;
  }
}
