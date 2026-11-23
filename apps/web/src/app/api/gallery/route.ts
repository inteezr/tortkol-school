import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublicData } from '@/lib/public-data';
import { invalidate } from '@/lib/invalidate';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';

// CDN'da uzoq keshlanmaydi: aks holda admin o'zgarishlari saytga kechikib yetadi. Server keshi (teglar) bazani himoya qiladi.
const CACHE = { 'Cache-Control': 'public, max-age=0, must-revalidate' };

export async function GET() {
  try {
    return NextResponse.json({ albums: (await getPublicData()).albums }, { headers: CACHE });
  } catch (e: any) {
    return NextResponse.json({ albums: [], error: e?.message || 'Xatolik' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}

const albumSchema = z.object({
  title: z.string().trim().min(2, 'Albom nomini kiriting').max(200),
  description: z.string().trim().max(500).nullish().transform((v) => v || ''),
  cover_image: z.string().trim().max(500).nullish().transform((v) => v || ''),
});
const photosSchema = z.object({ urls: z.array(z.string().trim().min(1).max(500)).min(1, 'Rasm tanlanmagan').max(50) });

async function guard() {
  if (!(await getAdmin())) return { err: NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 }) };
  const db = getDb();
  if (!db) return { err: NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 }) };
  return { db };
}
const fail = (e: any) =>
  e instanceof z.ZodError
    ? NextResponse.json({ error: e.errors[0]?.message || "Ma'lumotlar notöğri" }, { status: 400 })
    : NextResponse.json({ error: e.message || 'Server xatoligi' }, { status: 500 });

// POST /api/gallery                  -> yangi albom
// POST /api/gallery?album=ID         -> albomga rasmlar qo'shish { urls: [...] }
export async function POST(req: NextRequest) {
  const g = await guard();
  if ('err' in g) return g.err;
  try {
    const albumId = Number(new URL(req.url).searchParams.get('album'));
    const body = await req.json();
    if (albumId) {
      const { urls } = photosSchema.parse(body);
      // Rasmlar + (muqova bo'lmasa) muqovani o'rnatish — bitta so'rovda
      const rows = await g.db`with ins as (
          insert into media (album_id, type, url, sort_order)
          select ${albumId}, 'image', u, (select coalesce(max(sort_order), 0) from media where album_id = ${albumId}) + ord
          from unnest(${urls}::text[]) with ordinality as t(u, ord) returning id, url
        ), cov as (
          update albums set cover_image = ${urls[0]} where id = ${albumId} and (cover_image is null or cover_image = '')
        )
        select id, url from ins order by id`;
      invalidate('gallery');
      return NextResponse.json({ success: true, media: rows });
    }
    const v = albumSchema.parse(body);
    const slug = (v.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || 'album') + '-' + Date.now().toString().slice(-6);
    const [row] = await g.db`insert into albums (slug, title, description, cover_image, sort_order)
      values (${slug}, ${v.title}, ${v.description}, ${v.cover_image || null}, 0) returning *`;
    invalidate('gallery');
    return NextResponse.json({ success: true, album: row });
  } catch (e) { return fail(e); }
}

// PUT /api/gallery?id=ID -> albomni tahrirlash
export async function PUT(req: NextRequest) {
  const g = await guard();
  if ('err' in g) return g.err;
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 });
    const v = albumSchema.parse(await req.json());
    const [row] = await g.db`update albums set title=${v.title}, description=${v.description}, cover_image=${v.cover_image || null} where id=${id} returning *`;
    if (!row) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 });
    invalidate('gallery');
    return NextResponse.json({ success: true, album: row });
  } catch (e) { return fail(e); }
}

// DELETE /api/gallery?id=ID    -> albomni o'chirish
// DELETE /api/gallery?media=ID -> bitta rasmni o'chirish
export async function DELETE(req: NextRequest) {
  const g = await guard();
  if ('err' in g) return g.err;
  try {
    const sp = new URL(req.url).searchParams;
    const media = Number(sp.get('media'));
    const id = Number(sp.get('id'));
    if (media) await g.db`delete from media where id=${media}`;
    else if (id) await g.db`delete from albums where id=${id}`;
    else return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 });
    invalidate('gallery');
    return NextResponse.json({ success: true });
  } catch (e) { return fail(e); }
}
