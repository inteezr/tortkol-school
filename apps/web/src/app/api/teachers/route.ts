import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { unstable_cache, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';

const fetchRows = unstable_cache(
  async (key: string) => {
    const { data, error } = await supabase!.from(key).select('*').order('sort_order', { ascending: true });
    return { data: data || [], error: error?.message ?? null };
  },
  ['staff'],
  { revalidate: 300, tags: ['staff'] }
);

const CACHE = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

export async function GET(req: NextRequest) {
  const scope = new URL(req.url).searchParams.get('scope'); // 'leaders' | 'teachers'
  const key = scope === 'leaders' ? 'leaders' : 'teachers';

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ [key]: [], isLiveDatabase: false }, { headers: CACHE });
  }

  const { data, error } = await fetchRows(key);

  if (error) {
    console.error(`Supabase ${key} fetch error:`, error);
    return NextResponse.json({ [key]: [], error }, { status: 500 });
  }
  return NextResponse.json({ [key]: data || [] }, { headers: CACHE });
}

const opt = (max: number) => z.string().trim().max(max).optional().transform(v => v || '');
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
  if (!(await getAdmin())) return { err: NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 }) };
  const db = getDb();
  if (!db) return { err: NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 }) };
  const scope = new URL(req.url).searchParams.get('scope') === 'leaders' ? 'leaders' : 'teachers';
  return { db, scope: scope as 'leaders' | 'teachers' };
}
const fail = (e: any) =>
  e instanceof z.ZodError
    ? NextResponse.json({ error: e.errors[0]?.message || "Ma'lumotlar noto'g'ri" }, { status: 400 })
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
    revalidateTag('staff');
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
    revalidateTag('staff');
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
    revalidateTag('staff');
    return NextResponse.json({ success: true });
  } catch (e) { return fail(e); }
}
