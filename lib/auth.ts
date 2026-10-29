import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const COOKIE = 'ritm_admin_session';
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; startedAt: number }>();
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export function issueToken() { return randomBytes(32).toString('base64url'); }
export function issueCsrf() { return randomBytes(24).toString('base64url'); }

export function tooManyAttempts(key: string) {
  const item = attempts.get(key);
  if (!item || Date.now() - item.startedAt > WINDOW_MS) return false;
  return item.count >= 5;
}
export function failedAttempt(key: string) {
  const item = attempts.get(key);
  if (!item || Date.now() - item.startedAt > WINDOW_MS) attempts.set(key, { count: 1, startedAt: Date.now() });
  else item.count += 1;
}
export function clearAttempts(key: string) { attempts.delete(key); }

export async function currentAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.adminSession.findFirst({ where: { tokenHash: hash(token), expiresAt: { gt: new Date() } }, include: { user: true } });
  return session;
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
}
export function clearAdminCookie(response: NextResponse) { response.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 }); }
export async function requireCsrf(request: NextRequest) {
  const admin = await currentAdmin();
  if (!admin) return null;
  return request.headers.get('x-csrf-token') === admin.csrfToken ? admin : null;
}
export { hash };
