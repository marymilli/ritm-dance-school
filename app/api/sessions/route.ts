import { NextRequest, NextResponse } from 'next/server';
import { ACTIVE_BOOKING_STATUSES } from '@/lib/constants';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const direction = search.get('direction');
  const date = search.get('date');
  const weekday = search.get('weekday');
  const items = await db.classSession.findMany({ where: { ...(direction ? { direction } : {}), ...(date ? { startsAt: { gte: new Date(`${date}T00:00:00+03:00`), lt: new Date(`${date}T23:59:59+03:00`) } } : {}) }, include: { teacher: true, bookings: { where: { status: { in: ACTIVE_BOOKING_STATUSES } }, select: { id: true } } }, orderBy: { startsAt: 'asc' } });
  const result = items.filter((item) => !weekday || String(new Date(item.startsAt).getDay()) === weekday).map((item) => ({ ...item, freePlaces: Math.max(0, item.capacity - item.bookings.length), canBook: item.status === 'ACTIVE' && item.startsAt > new Date() && item.capacity > item.bookings.length }));
  return NextResponse.json(result);
}
