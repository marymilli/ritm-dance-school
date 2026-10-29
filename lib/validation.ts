import { z } from 'zod';

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) return `+7${digits.slice(1)}`;
  throw new Error('Введите российский номер в формате +7 (999) 000-00-00');
}

export const bookingSchema = z.object({
  classSessionId: z.string().min(1),
  name: z.string().trim().min(2, 'Укажите имя').max(80),
  phone: z.string().min(1, 'Укажите телефон'),
  email: z.union([z.literal(''), z.string().email('Проверьте email')]).optional(),
  comment: z.string().max(500, 'Комментарий не длиннее 500 символов').optional(),
  consent: z.literal(true, { error: 'Нужно согласие на обработку данных' }),
  requestKey: z.string().uuid(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const sessionSchema = z.object({
  direction: z.enum(['Bachata', 'Hip-Hop', 'Contemporary', 'Stretching']),
  teacherId: z.string().min(1),
  startsAt: z.string().datetime(),
  durationMin: z.coerce.number().int().min(30).max(180),
  level: z.string().trim().min(2).max(50),
  room: z.string().trim().min(2).max(50),
  capacity: z.coerce.number().int().min(1).max(50),
});
