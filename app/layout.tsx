import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });

export const metadata: Metadata = {
  title: 'INQUIS // Imperial Intelligence Command Portal',
  description:
    'Military-grade command portal for coordinating galaxy-wide Inquisitorius operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrains.variable} ${space.variable} font-body`}
      >
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
