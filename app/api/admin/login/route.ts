import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { clearAttempts, failedAttempt, hash, issueCsrf, issueToken, setAdminCookie, tooManyAttempts } from '@/lib/auth';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const key = request.headers.get('x-forwarded-for') ?? 'local';
  if (tooManyAttempts(key)) return NextResponse.json({ message: 'Слишком много попыток. Попробуйте через 15 минут.' }, { status: 429 });
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: 'Введите email и пароль' }, { status: 422 });
  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) { failedAttempt(key); return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 }); }
  clearAttempts(key);
  const token = issueToken(); const csrfToken = issueCsrf();
  await db.adminSession.create({ data: { tokenHash: hash(token), csrfToken, userId: user.id, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) } });
  const response = NextResponse.json({ csrfToken }); setAdminCookie(response, token); return response;
}
