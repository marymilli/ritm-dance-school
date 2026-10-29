import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const reset = process.argv.includes('--reset');
function atOffset(days, hour, minute = 0) { const date = new Date(); date.setDate(date.getDate() + days); date.setHours(hour, minute, 0, 0); return date; }
async function main() {
  const existing = await db.classSession.count();
  if (existing && !reset) { console.log('Демобаза уже заполнена. Для сброса используйте npm run db:reset-demo'); return; }
  if (reset) { await db.notification.deleteMany(); await db.booking.deleteMany(); await db.classSession.deleteMany(); await db.teacher.deleteMany(); await db.adminSession.deleteMany(); await db.adminUser.deleteMany(); await db.demoSetting.deleteMany(); }
  const [anna, maxim, elena, darya] = await Promise.all([
    db.teacher.create({ data: { name: 'Анна Миронова', direction: 'Bachata', experience: 7 } }), db.teacher.create({ data: { name: 'Максим Орлов', direction: 'Hip-Hop', experience: 6 } }), db.teacher.create({ data: { name: 'Елена Волкова', direction: 'Contemporary', experience: 8 } }), db.teacher.create({ data: { name: 'Дарья Соколова', direction: 'Stretching', experience: 5 } }),
  ]);
  const lessons = await Promise.all([
    db.classSession.create({ data: { direction: 'Bachata', teacherId: anna.id, startsAt: atOffset(1, 19), durationMin: 60, level: 'Начинающие', room: 'Лофт', capacity: 10 } }), db.classSession.create({ data: { direction: 'Hip-Hop', teacherId: maxim.id, startsAt: atOffset(2, 18), durationMin: 60, level: 'Начинающие', room: 'Бит', capacity: 2 } }), db.classSession.create({ data: { direction: 'Contemporary', teacherId: elena.id, startsAt: atOffset(3, 19, 30), durationMin: 75, level: 'Начинающие', room: 'Лофт', capacity: 2 } }), db.classSession.create({ data: { direction: 'Stretching', teacherId: darya.id, startsAt: atOffset(4, 11), durationMin: 60, level: 'Любой уровень', room: 'Баланс', capacity: 8 } }), db.classSession.create({ data: { direction: 'Bachata', teacherId: anna.id, startsAt: atOffset(-1, 18), durationMin: 60, level: 'Начинающие', room: 'Лофт', capacity: 10 } }), db.classSession.create({ data: { direction: 'Hip-Hop', teacherId: maxim.id, startsAt: atOffset(6, 18), durationMin: 60, level: 'Любой уровень', room: 'Бит', capacity: 12 } }), db.classSession.create({ data: { direction: 'Contemporary', teacherId: elena.id, startsAt: atOffset(9, 19, 30), durationMin: 75, level: 'Средний', room: 'Лофт', capacity: 10 } }), db.classSession.create({ data: { direction: 'Stretching', teacherId: darya.id, startsAt: atOffset(12, 11), durationMin: 60, level: 'Любой уровень', room: 'Баланс', capacity: 8 } }),
  ]);
  const filled = async (lesson, count) => Promise.all(Array.from({ length: count }, (_, i) => db.booking.create({ data: { number: `SEED-${lesson.id.slice(-4)}-${i}`, classSessionId: lesson.id, name: `Тестовый ученик ${i + 1}`, phone: `+7999000${String(i).padStart(4, '0')}`, phoneNormalized: `+7999000${String(i).padStart(4, '0')}`, consent: true, status: i % 2 ? 'CONFIRMED' : 'NEW', requestKey: `seed-${lesson.id}-${i}` } })));
  await filled(lessons[0], 8); await filled(lessons[1], 1); await filled(lessons[2], 2);
  await db.adminUser.create({ data: { email: 'admin@ritm.test', passwordHash: await bcrypt.hash('Demo-Ritm-2026!', 12) } });
  await db.demoSetting.create({ data: { id: 1 } });
  console.log('Демоданные созданы. Администратор: admin@ritm.test');
}
main().finally(() => db.$disconnect());
