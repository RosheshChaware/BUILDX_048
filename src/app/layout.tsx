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
    <html lang="en" className="dark h-full">
      <body className="h-full bg-[#080c14] text-slate-100 antialiased overflow-x-hidden">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
