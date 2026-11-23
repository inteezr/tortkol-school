import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublicData, DEFAULT_SETTINGS } from '@/lib/public-data';
import { invalidate } from '@/lib/invalidate';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';

const KEYS = { students: 'stat_students', teachers: 'stat_teachers', classes: 'stat_classes', photo: 'school_photo' } as const;

// CDN'da uzoq keshlanmaydi: aks holda admin o'zgarishlari saytga kechikib yetadi. Server keshi (teglar) bazani himoya qiladi.
const CACHE = { 'Cache-Control': 'public, max-age=0, must-revalidate' };

export async function GET() {
  try {
    return NextResponse.json((await getPublicData()).settings, { headers: CACHE });
  } catch (e) {
    console.error('site-settings read error:', e);
    return NextResponse.json(DEFAULT_SETTINGS, { headers: { 'Cache-Control': 'no-store' } });
  }
}

const count = z.coerce.number().int().min(0).max(100000);
const schema = z.object({ students: count, teachers: count, classes: count, photo: z.string().trim().max(500).default('') });

export async function PUT(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 500 });
  try {
    const b = schema.parse(await req.json());
    const entries: [string, string][] = [
      [KEYS.students, String(b.students)], [KEYS.teachers, String(b.teachers)],
      [KEYS.classes, String(b.classes)], [KEYS.photo, b.photo],
    ];
    // Bitta so'rovda hammasi (har bir so'rov uzoq bazaga ~0.4 s ketadi)
    await db`insert into site_settings (key, value, updated_at)
             select k, v, now() from unnest(${entries.map((e) => e[0])}::text[], ${entries.map((e) => e[1])}::text[]) as t(k, v)
             on conflict (key) do update set value = excluded.value, updated_at = now()`;
    invalidate('site-settings');
    return NextResponse.json({ success: true, students: b.students, teachers: b.teachers, classes: b.classes, photo: b.photo });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message || "Notöğri qiymat" }, { status: 400 });
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}
