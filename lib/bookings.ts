import { randomUUID } from 'crypto';
import { ACTIVE_BOOKING_STATUSES, SCHOOL } from '@/lib/constants';
import { db } from '@/lib/db';
import { normalizePhone } from '@/lib/validation';

export class BookingError extends Error { constructor(public code: string, message: string) { super(message); } }

export async function createBooking(input: { classSessionId: string; name: string; phone: string; email?: string; comment?: string; consent: boolean; requestKey: string }) {
  const normalized = normalizePhone(input.phone);
  return db.$transaction(async (tx) => {
    const replay = await tx.booking.findUnique({ where: { requestKey: input.requestKey }, include: { classSession: { include: { teacher: true } }, notification: true } });
    if (replay) return { booking: replay, replayed: true };
    const lesson = await tx.classSession.findUnique({ where: { id: input.classSessionId }, include: { teacher: true } });
    if (!lesson || lesson.status !== 'ACTIVE' || lesson.startsAt <= new Date()) throw new BookingError('UNAVAILABLE', 'Запись на это занятие недоступна');
    const activeCount = await tx.booking.count({ where: { classSessionId: lesson.id, status: { in: ACTIVE_BOOKING_STATUSES } } });
    if (activeCount >= lesson.capacity) throw new BookingError('FULL', 'К сожалению, мест уже нет');
    const duplicate = await tx.booking.findFirst({ where: { classSessionId: lesson.id, phoneNormalized: normalized, status: { in: ACTIVE_BOOKING_STATUSES } } });
    if (duplicate) throw new BookingError('DUPLICATE', 'На это занятие уже есть активная запись с этим номером');
    const number = `RTM-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const booking = await tx.booking.create({ data: { number, classSessionId: lesson.id, name: input.name.trim(), phone: input.phone.trim(), phoneNormalized: normalized, email: input.email || null, comment: input.comment || null, consent: input.consent, requestKey: input.requestKey } });
    const payload = `Новая запись ${number}: ${lesson.direction}, ${lesson.startsAt.toLocaleString('ru-RU', { timeZone: SCHOOL.timezone })}.`;
    const settings = await tx.demoSetting.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
    const notification = await tx.notification.create({ data: { bookingId: booking.id, payload, failNextDemo: settings.failNextNotification } });
    if (settings.failNextNotification) await tx.demoSetting.update({ where: { id: 1 }, data: { failNextNotification: false } });
    return { booking: { ...booking, classSession: lesson, notification }, replayed: false };
  });
}
