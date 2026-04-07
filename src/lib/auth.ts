import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET;
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is not defined in production environment');
}

const secretKey = new TextEncoder().encode(secret);

export async function signToken(payload: { id: string; role: string; fullName: string; avatarUrl?: string | null }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3d') // 3 days
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { id: string; role: string; fullName: string; avatarUrl?: string | null };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3 * 24 * 60 * 60, // 3 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
