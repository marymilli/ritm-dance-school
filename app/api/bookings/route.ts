import { NextRequest, NextResponse } from 'next/server';
import { createBooking, BookingError } from '@/lib/bookings';
import { deliverNotification } from '@/lib/notifications';
import { bookingSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: 'Проверьте поля формы', errors: parsed.error.flatten().fieldErrors }, { status: 422 });
    const result = await createBooking(parsed.data);
    if (!result.replayed) await deliverNotification(result.booking.notification.id);
    return NextResponse.json({ number: result.booking.number, bookingId: result.booking.id, replayed: result.replayed }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingError) return NextResponse.json({ message: error.message, code: error.code }, { status: 409 });
    if (error instanceof Error && error.message.includes('российский номер')) return NextResponse.json({ message: error.message, errors: { phone: [error.message] } }, { status: 422 });
    return NextResponse.json({ message: 'Не удалось сохранить заявку. Повторите попытку.' }, { status: 500 });
  }
}
