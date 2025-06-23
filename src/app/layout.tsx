import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from 'geist/font/sans';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tic-Tac-Toe Arena',
  description: 'The ultimate online Tic-Tac-Toe showdown.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", GeistSans.className)}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
