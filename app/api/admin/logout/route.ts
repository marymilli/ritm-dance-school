import { NextRequest, NextResponse } from 'next/server';
import { clearAdminCookie, currentAdmin, requireCsrf } from '@/lib/auth';
import { db } from '@/lib/db';
export async function POST(request: NextRequest) { const admin = await requireCsrf(request); if (!admin) return NextResponse.json({ message: 'Нет доступа' }, { status: 403 }); await db.adminSession.delete({ where: { id: admin.id } }); const response = NextResponse.json({ ok: true }); clearAdminCookie(response); return response; }
