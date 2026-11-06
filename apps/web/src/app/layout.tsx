import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = { title: 'Northstar Advisory', description: 'Business acquisition opportunities for searchers and investors.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><AuthProvider><Header />{children}</AuthProvider></body></html>; }
