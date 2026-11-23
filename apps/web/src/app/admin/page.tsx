import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/admin-auth';
import { getAdminData } from '@/lib/admin-data';
import AdminApp from './AdminApp';
import { AdminShellSkeleton } from './AdminSkeleton';

export const metadata = { title: 'Boşqaruv paneli | Törtköl IM' };

// Barcha ma'lumot serverda, bitta so'rovda yig'iladi va tayyor holda yuboriladi:
// brauzerda "avval tekshir, keyin 4 ta so'rov yubor" zanjiri yo'q.
async function AdminContent({ username }: { username: string }) {
  const data = await getAdminData();
  return <AdminApp initial={data} username={username} />;
}

export default async function AdminPage() {
  const admin = await getAdmin(); // faqat cookie imzosi (bazaga bormaydi)
  if (!admin) redirect('/admin/login');
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <AdminContent username={admin.user || 'admin'} />
    </Suspense>
  );
}
