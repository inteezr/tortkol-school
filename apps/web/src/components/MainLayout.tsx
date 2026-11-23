'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ScrollReveal } from './ScrollReveal';
import { ScrollTopButton } from './ScrollTopButton';

// Navbar/Footer (framer-motion va h.k.) faqat ommaviy saytda yuklanadi — admin panel ularni yuklamaydi.
const Navbar = dynamic(() => import('./Navbar').then((m) => m.Navbar));
const Footer = dynamic(() => import('./Footer').then((m) => m.Footer));

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-grow overflow-x-clip">{children}</main>
      <ScrollReveal />
      <ScrollTopButton />
      <Footer />
    </>
  );
};
