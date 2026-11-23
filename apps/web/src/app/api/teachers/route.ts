import { NextRequest, NextResponse } from 'next/server';
import { getPublicData } from '@/lib/public-data';
import { invalidate } from '@/lib/invalidate';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';

// CDN'da uzoq keshlanmaydi: aks holda admin o'zgarishlari saytga kechikib yetadi. Server keshi (teglar) bazani himoya qiladi.
const CACHE = { 'Cache-Control': 'public, max-age=0, must-revalidate' };

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('scope') === 'leaders' ? 'leaders' : 'teachers';
  try {
    const data = await getPublicData();
    return NextResponse.json({ [key]: data[key] }, { headers: CACHE });
  } catch (e: any) {
    console.error(`${key} fetch error:`, e?.message);
    return NextResponse.json({ [key]: [], error: e?.message || 'Xatolik' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}

// Baza bo'sh maydonlar uchun null qaytaradi: null/undefined ni bo'sh matn sifatida qabul qilamiz.
const opt = (max: number) => z.string().trim().max(max).nullish().transform(v => v || '');
const teacherSchema = z.object({
  full_name: z.string().trim().min(3, 'Ism-familiya kamida 3 belgi').max(150),
  subject: z.string().trim().min(2, 'Fanni kiriting').max(150),
  category: opt(100),
  experience: opt(50),
  bio: opt(1000),
  education: opt(2000),
  achievements: opt(3000),
  photo_url: opt(500),
});
const leaderSchema = z.object({
  full_name: z.string().trim().min(3, 'Ism-familiya kamida 3 belgi').max(150),
  role: z.string().trim().min(2, 'Lavozimni kiriting').max(150),
  reception_days: z.string().trim().min(2, 'Qabul kunlarini kiriting').max(255),
  phone: opt(50),
  email: opt(100),
  bio: opt(2000),
  photo_url: opt(500),
});

async function guard(req: NextRequest) {
  if (!(await getAdmin())) return { err: NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 }) };
  const db = getDb();
  if (!db) return { err: NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 }) };
  const scope = new URL(req.url).searchParams.get('scope') === 'leaders' ? 'leaders' : 'teachers';
  return { db, scope: scope as 'leaders' | 'teachers' };
}
const fail = (e: any) =>
  e instanceof z.ZodError
    ? NextResponse.json({ error: e.errors[0]?.message || "Ma'lumotlar notöğri" }, { status: 400 })
    : NextResponse.json({ error: e.message || 'Server xatoligi' }, { status: 500 });

// Yaratish: POST /api/teachers?scope=teachers|leaders
export async function POST(req: NextRequest) {
  const g = await guard(req);
  if ('err' in g) return g.err;
  try {
    const body = await req.json();
    let row;
    if (g.scope === 'teachers') {
      const v = teacherSchema.parse(body);
      [row] = await g.db`insert into teachers (full_name, subject, category, experience, bio, education, achievements, photo_url, sort_order)
        values (${v.full_name}, ${v.subject}, ${v.category}, ${v.experience}, ${v.bio}, ${v.education}, ${v.achievements}, ${v.photo_url},
          (select coalesce(max(sort_order), 0) + 1 from teachers)) returning *`;
    } else {
      const v = leaderSchema.parse(body);
      [row] = await g.db`insert into leaders (full_name, role, reception_days, phone, email, bio, photo_url, sort_order)
        values (${v.full_name}, ${v.role}, ${v.reception_days}, ${v.phone || null}, ${v.email || null}, ${v.bio}, ${v.photo_url},
          (select coalesce(max(sort_order), 0) + 1 from leaders)) returning *`;
    }
    invalidate('staff');
    return NextResponse.json({ success: true, item: row });
  } catch (e) { return fail(e); }
}

// Tahrirlash: PUT /api/teachers?scope=...&id=N
export async function PUT(req: NextRequest) {
  const g = await guard(req);
  if ('err' in g) return g.err;
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 });
    const body = await req.json();
    let row;
    if (g.scope === 'teachers') {
      const v = teacherSchema.parse(body);
      [row] = await g.db`update teachers set full_name=${v.full_name}, subject=${v.subject}, category=${v.category}, experience=${v.experience},
        bio=${v.bio}, education=${v.education}, achievements=${v.achievements}, photo_url=${v.photo_url}, updated_at=now()
        where id=${id} returning *`;
    } else {
      const v = leaderSchema.parse(body);
      [row] = await g.db`update leaders set full_name=${v.full_name}, role=${v.role}, reception_days=${v.reception_days}, phone=${v.phone || null},
        email=${v.email || null}, bio=${v.bio}, photo_url=${v.photo_url}, updated_at=now()
        where id=${id} returning *`;
    }
    if (!row) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 });
    invalidate('staff');
    return NextResponse.json({ success: true, item: row });
  } catch (e) { return fail(e); }
}

// O'chirish: DELETE /api/teachers?scope=...&id=N
export async function DELETE(req: NextRequest) {
  const g = await guard(req);
  if ('err' in g) return g.err;
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 });
    if (g.scope === 'teachers') await g.db`delete from teachers where id=${id}`;
    else await g.db`delete from leaders where id=${id}`;
    invalidate('staff');
    return NextResponse.json({ success: true });
  } catch (e) { return fail(e); }
}
