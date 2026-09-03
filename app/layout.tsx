import type { Metadata } from 'next';
import { Manrope, Unbounded } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ variable: '--font-body', subsets: ['cyrillic', 'latin'] });
const unbounded = Unbounded({ variable: '--font-display', subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  title: 'РИТМ — школа танцев в Москве',
  description: 'Contemporary, High Heels и Hip-Hop для любого уровня. Первый урок бесплатно.',
  openGraph: { title: 'РИТМ — найди свой ритм', description: 'Школа танцев в Москве. Первый урок бесплатно.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'РИТМ — школа танцев', description: 'Танцуй свободно. Первый урок бесплатно.', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${manrope.variable} ${unbounded.variable}`}>{children}</body></html>;
}
