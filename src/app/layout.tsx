import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XII RPL ONE - Techcrafters',
  description: 'Official Web & Memories Portal XII RPL ONE',
  icons: {
    icon: '/ikon kelas-circle.PNG',
    shortcut: '/ikon kelas.PNG',
    apple: '/ikon kelas.PNG',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}