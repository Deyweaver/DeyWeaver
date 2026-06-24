
import type { Metadata } from 'next';
import { Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import ClientProviders from '@/components/layout/client-providers';
import { AuthProvider } from '@/components/auth/auth-provider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Dey Weaver',
  description: 'Your day. Your goals. No stress. Let AI handle the mess.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${syne.variable} font-sans antialiased`}
      >
        <ClientProviders>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
