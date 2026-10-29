import { NextRequest, NextResponse } from 'next/server';
import { ACTIVE_BOOKING_STATUSES } from '@/lib/constants';
import { requireCsrf, currentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() { if (!await currentAdmin()) return NextResponse.json({ message: 'Нет доступа' }, { status: 401 }); const bookings = await db.booking.findMany({ include: { classSession: { include: { teacher: true } }, notification: true }, orderBy: { createdAt: 'desc' } }); return NextResponse.json(bookings); }
export async function PATCH(request: NextRequest) {
  const admin = await requireCsrf(request); if (!admin) return NextResponse.json({ message: 'Нет доступа' }, { status: 403 });
  const { id, status } = await request.json(); if (!['NEW', 'CONFIRMED', 'CANCELLED'].includes(status)) return NextResponse.json({ message: 'Некорректный статус' }, { status: 422 });
  const booking = await db.booking.findUnique({ where: { id }, include: { classSession: true } }); if (!booking) return NextResponse.json({ message: 'Заявка не найдена' }, { status: 404 });
  if (ACTIVE_BOOKING_STATUSES.includes(status) && !ACTIVE_BOOKING_STATUSES.includes(booking.status)) { const count = await db.booking.count({ where: { classSessionId: booking.classSessionId, status: { in: ACTIVE_BOOKING_STATUSES } } }); if (count >= booking.classSession.capacity) return NextResponse.json({ message: 'Нельзя восстановить: группа заполнена' }, { status: 409 }); }
  return NextResponse.json(await db.booking.update({ where: { id }, data: { status } }));
}
