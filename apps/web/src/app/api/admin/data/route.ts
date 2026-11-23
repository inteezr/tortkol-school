import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/admin-auth';
import { loadAdminData } from '@/lib/admin-data';

// "Yangilash" tugmasi uchun: keshsiz, bitta SQL so'rov.
export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
  try {
    return NextResponse.json(await loadAdminData(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Xatolik' }, { status: 500 });
  }
}
