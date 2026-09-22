import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'SURAKSHA-NET | Mass Gathering Security Operations Center',
  description: 'AI-Powered Incident Coordination, Missing Persons Tracing & Crowd Intelligence Platform for Large Gatherings (Deekshabhoomi, Nagpur).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body className="h-full bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden transition-colors duration-200">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
