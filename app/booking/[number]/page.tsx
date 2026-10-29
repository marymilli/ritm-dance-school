import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatDateTime, formatMoney } from '@/lib/format';
import { SCHOOL } from '@/lib/constants';

export default async function Confirmation({ params }: { params: Promise<{ number: string }> }) { const { number } = await params; const booking = await db.booking.findUnique({ where: { number }, include: { classSession: { include: { teacher: true } } } }); if (!booking) notFound(); return <main className="confirmation"><Link href="/" className="logo">РИТМ<span>.</span></Link><div><p className="badge">Запись принята</p><h1>До встречи<br/><i>на танцах!</i></h1><p>Номер записи: <strong>{booking.number}</strong></p><article><h2>{booking.classSession.direction}</h2><p>{formatDateTime(booking.classSession.startsAt)}</p><p>{booking.classSession.teacher.name} · зал «{booking.classSession.room}»</p><p>{formatMoney(SCHOOL.trialPrice)} · Оплата в школе</p><p>Адрес: {SCHOOL.city}, {SCHOOL.address} <small>(демонстрационный)</small></p></article><Link className="button" href="/">Вернуться на главную</Link></div></main> }
