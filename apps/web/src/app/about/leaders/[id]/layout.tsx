import { toNewAlphabet } from '@/lib/alphabet';
import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicDataSafe } from '../../../../lib/public-data';

// Mavjud rahbarlar sahifalari oldindan tayyorlanadi; yangi qo'shilgani birinchi ochilganda tayyorlanadi.
// Admin o'zgartirsa (teglar orqali) darhol yangilanadi.
export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await getPublicDataSafe();
  return (data?.leaders || []).map((x: any) => ({ id: String(x.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = (await getPublicDataSafe())?.leaders.find((x: any) => String(x.id) === id);
  return p ? { title: `${toNewAlphabet(p.full_name)} | Törtköl IM` } : {};
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPublicDataSafe();
  // Ma'lumot olingan bo'lsa va bunday id yo'q bo'lsa — haqiqiy 404
  if (data && !data.leaders.some((x: any) => String(x.id) === id)) notFound();
  return <>{children}</>;
}
