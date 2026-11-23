import type { Metadata } from 'next';
import './globals.css';

import { LanguageProvider } from '../lib/LanguageContext';
import { ToastProvider } from '../lib/ToastContext';
import { MainLayout } from '../components/MainLayout';
import { DataSeed } from '../components/DataSeed';
import { getPublicDataSafe } from '../lib/public-data';

// Sahifalar oldindan tayyorlanadi (CDN'dan darhol). Admin o'zgarishi bo'lsa darhol yangilanadi (teglar),
// bu qiymat — faqat zaxira yangilanish oralig'i.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Törtköl tuman ixtisoslaştirilgan maktabi | Rasmiy veb-platformasi",
  description: "Qoraqalpoğiston Respublikasi Törtköl tuman ixtisoslaştirilgan maktabining rasmiy veb-sayti va platformasi.",
  keywords: ["Törtköl maktabi", "ixtisoslaştirilgan maktab", "aniq fanlar", "tabiiy fanlar", "piima", "qabul"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ommaviy ma'lumot serverda bir marta olinadi va sahifa bilan birga yuboriladi (brauzer bazani kutmaydi).
  const data = await getPublicDataSafe();
  const seed = data && {
    '/api/posts': { posts: data.posts },
    '/api/teachers?scope=leaders': { leaders: data.leaders },
    '/api/teachers?scope=teachers': { teachers: data.teachers },
    '/api/gallery': { albums: data.albums },
    '/api/site-settings': data.settings,
  };
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F3F8FE] text-[#021024] antialiased">
        <LanguageProvider>
          <ToastProvider>
            <DataSeed entries={seed}>
              <MainLayout>
                {children}
              </MainLayout>
            </DataSeed>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
