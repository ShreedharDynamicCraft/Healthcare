import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '@/components/AuthInitializer';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Allo Health - Sexual Wellness Clinic',
  description: 'Professional sexual wellness clinic management platform - Confidential, secure, and caring healthcare solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthInitializer />
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-gray-900 dark:to-indigo-950">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: '#fff',
                borderRadius: '16px',
                padding: '16px',
                fontWeight: '500',
                boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
              },
              success: {
                style: {
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
} 