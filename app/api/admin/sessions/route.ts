import { NextRequest, NextResponse } from 'next/server';
import { ACTIVE_BOOKING_STATUSES } from '@/lib/constants';
import { requireCsrf, currentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { sessionSchema } from '@/lib/validation';

export async function GET() { if (!await currentAdmin()) return NextResponse.json({ message: 'Нет доступа' }, { status: 401 }); return NextResponse.json(await db.classSession.findMany({ include: { teacher: true, bookings: { where: { status: { in: ACTIVE_BOOKING_STATUSES } }, select: { id: true } } }, orderBy: { startsAt: 'asc' } })); }
export async function POST(request: NextRequest) { const admin = await requireCsrf(request); if (!admin) return NextResponse.json({ message: 'Нет доступа' }, { status: 403 }); const parsed = sessionSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ message: 'Проверьте поля' }, { status: 422 }); return NextResponse.json(await db.classSession.create({ data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt) } }), { status: 201 }); }
export async function PATCH(request: NextRequest) {
  const admin = await requireCsrf(request); if (!admin) return NextResponse.json({ message: 'Нет доступа' }, { status: 403 }); const body = await request.json(); const parsed = sessionSchema.safeParse(body); if (!parsed.success || !body.id) return NextResponse.json({ message: 'Проверьте поля' }, { status: 422 });
  const current = await db.classSession.findUnique({ where: { id: body.id } }); if (!current) return NextResponse.json({ message: 'Занятие не найдено' }, { status: 404 });
  const activeCount = await db.booking.count({ where: { classSessionId: current.id, status: { in: ACTIVE_BOOKING_STATUSES } } }); if (parsed.data.capacity < activeCount) return NextResponse.json({ message: 'Вместимость ниже числа активных заявок' }, { status: 409 });
  return NextResponse.json(await db.classSession.update({ where: { id: body.id }, data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt) } }));
}
export async function DELETE(request: NextRequest) { const admin = await requireCsrf(request); if (!admin) return NextResponse.json({ message: 'Нет доступа' }, { status: 403 }); const id = request.nextUrl.searchParams.get('id'); if (!id) return NextResponse.json({ message: 'Нет id' }, { status: 422 }); const lesson = await db.classSession.findUnique({ where: { id }, include: { bookings: true } }); if (!lesson) return NextResponse.json({ message: 'Занятие не найдено' }, { status: 404 }); await db.$transaction([db.classSession.update({ where: { id }, data: { status: 'CANCELLED' } }), db.booking.updateMany({ where: { classSessionId: id, status: { in: ACTIVE_BOOKING_STATUSES } }, data: { status: 'CANCELLED' } })]); return NextResponse.json({ ok: true, warning: lesson.bookings.length ? 'Активные заявки отменены; сообщите клиентам об отмене.' : null }); }
