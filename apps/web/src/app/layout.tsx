import type { Metadata } from 'next';
import './globals.css';
import { Onest, Bricolage_Grotesque } from 'next/font/google';

const onest = Onest({ subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap', variable: '--font-onest' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-display' });
import { LanguageProvider } from '../lib/LanguageContext';
import { ToastProvider } from '../lib/ToastContext';
import { MainLayout } from '../components/MainLayout';

export const metadata: Metadata = {
  title: "To'rtko'l tuman ixtisoslashtirilgan maktabi | Rasmiy veb-platformasi",
  description: "Qoraqalpog'iston Respublikasi To'rtko'l tuman ixtisoslashtirilgan maktabining rasmiy veb-sayti va platformasi.",
  keywords: ["To'rtko'l maktabi", "ixtisoslashtirilgan maktab", "aniq fanlar", "tabiiy fanlar", "piima", "qabul"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${onest.variable} ${bricolage.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F7FAFF] text-[#0F172A] antialiased">
        <LanguageProvider>
          <ToastProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
