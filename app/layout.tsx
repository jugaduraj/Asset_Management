
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { CookiesProvider } from 'next-client-cookies/server';
import DashboardLayout from './dashboard-layout';
import { UserProvider } from '@/context/user-context';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'AssetZen',
  description: 'An intelligent asset management application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <CookiesProvider>
          <AuthProvider>
            <UserProvider>
              <ThemeProvider attribute="class" defaultTheme="dark">
                <DashboardLayout>{children}</DashboardLayout>
                <Toaster />
              </ThemeProvider>
            </UserProvider>
          </AuthProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
