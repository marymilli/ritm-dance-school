import { db } from '@/lib/db';

export async function deliverNotification(notificationId: string) {
  const notice = await db.notification.findUnique({ where: { id: notificationId }, include: { booking: true } });
  if (!notice) throw new Error('Уведомление не найдено');
  const demo = (process.env.TELEGRAM_MODE ?? 'demo') === 'demo';
  const shouldFail = notice.failNextDemo;
  if (demo) {
    await db.notification.update({ where: { id: notice.id }, data: { status: shouldFail ? 'FAILED' : 'DEMO_READY', attempts: { increment: 1 }, lastError: shouldFail ? 'Демо: имитация сбоя отправки' : null, failNextDemo: false } });
    return;
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    await db.notification.update({ where: { id: notice.id }, data: { status: 'FAILED', attempts: { increment: 1 }, lastError: 'Telegram не настроен' } });
    return;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: notice.payload }) });
    if (!response.ok) throw new Error('Telegram вернул ошибку');
    await db.notification.update({ where: { id: notice.id }, data: { status: 'SENT', attempts: { increment: 1 }, lastError: null } });
  } catch {
    await db.notification.update({ where: { id: notice.id }, data: { status: 'FAILED', attempts: { increment: 1 }, lastError: 'Не удалось отправить уведомление' } });
  }
}
