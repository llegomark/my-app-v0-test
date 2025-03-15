// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { LayoutProps } from '@/types/component-types';
import { SupabaseProvider } from '@/providers/supabase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NQESH Reviewer',
  description: 'A comprehensive reviewer application for the National Qualifying Examination for School Heads (NQESH)',
};

export default function RootLayout({ children }: LayoutProps): React.ReactElement {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}