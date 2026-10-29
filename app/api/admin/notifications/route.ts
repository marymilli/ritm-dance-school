import { NextRequest, NextResponse } from 'next/server';
import { requireCsrf, currentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { deliverNotification } from '@/lib/notifications';
export async function GET() { if (!await currentAdmin()) return NextResponse.json({ message: 'Нет доступа' }, { status: 401 }); return NextResponse.json(await db.notification.findMany({ include: { booking: { include: { classSession: true } } }, orderBy: { createdAt: 'desc' } })); }
export async function POST(request: NextRequest) { const admin = await requireCsrf(request); if (!admin) return NextResponse.json({ message: 'Нет доступа' }, { status: 403 }); const { action, id } = await request.json(); if (action === 'fail-next') { await db.demoSetting.upsert({ where: { id: 1 }, create: { id: 1, failNextNotification: true }, update: { failNextNotification: true } }); return NextResponse.json({ ok: true }); } if (action === 'retry' && id) { await deliverNotification(id); return NextResponse.json({ ok: true }); } return NextResponse.json({ message: 'Неизвестное действие' }, { status: 422 }); }
