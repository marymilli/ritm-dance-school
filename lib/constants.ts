export const SCHOOL = {
  name: 'Ритм',
  city: 'Казань',
  address: 'ул. Танцевальная, 12',
  timezone: 'Europe/Moscow',
  trialPrice: 500,
} as const;

export const DIRECTIONS = ['Bachata', 'Hip-Hop', 'Contemporary', 'Stretching'] as const;
export type Direction = (typeof DIRECTIONS)[number];
export const ACTIVE_BOOKING_STATUSES = ['NEW', 'CONFIRMED'];
