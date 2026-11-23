import { NextRequest, NextResponse } from 'next/server';
import { getPublicData, getPostBySlug } from '@/lib/public-data';
import { invalidate } from '@/lib/invalidate';
import { isCategorySlug } from '@/lib/post-categories';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';
import { toNewAlphabet } from '@/lib/alphabet';

// CDN'da uzoq keshlanmaydi: aks holda admin o'zgarishlari saytga kechikib yetadi. Server keshi (teglar) bazani himoya qiladi.
const CACHE = { 'Cache-Control': 'public, max-age=0, must-revalidate' };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type');
    const id = Number(searchParams.get('id'));
    // Admin: bitta postni to'liq (matni bilan, qoralama bo'lsa ham) tahrirlash uchun
    if (id) {
      if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
      const db = getDb();
      if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
      const [post] = await db`
        select p.id, p.slug, p.type, p.title, p.excerpt, p.content, p.cover_image, p.status, p.published_at, c.slug as category
        from posts p left join categories c on c.id = p.category_id where p.id = ${id}`;
      if (!post) return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 });
      for (const k of ['title', 'excerpt', 'content'] as const) post[k] = toNewAlphabet(post[k]);
      return NextResponse.json({ post }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (slug) {
      const post = await getPostBySlug(slug);
      return NextResponse.json({ posts: post ? [post] : [] }, { headers: CACHE });
    }
    const { posts } = await getPublicData();
    return NextResponse.json({ posts: type ? posts.filter((p) => p.type === type) : posts }, { headers: CACHE });
  } catch (e: any) {
    console.error('posts fetch error:', e?.message);
    return NextResponse.json({ posts: [], error: e?.message || 'Xatolik yuz berdi' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
  try {
    const body = await req.json();
    const { title, excerpt, content, type = 'news', status = 'published', coverImage, category } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Sarlavha va matn talab qilinadi' }, { status: 400 });
    }
    if (!isCategorySlug(category)) {
      return NextResponse.json({ error: 'Turkumni tanlang (Olimpiada, Ta’lim, Tadbirlar yoki E’lonlar)' }, { status: 400 });
    }
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-6);

    // Bitta so'rovda: post + tarjima navbati (baza uzoqda, har bir so'rov ~0.3-1 s)
    const [post] = await db`
      with p as (
        insert into posts (slug, title, excerpt, content, type, status, cover_image, published_at, category_id)
        values (${slug}, ${title}, ${excerpt || title.slice(0, 160)}, ${content}, ${type}, ${status}, ${coverImage || null}, now(),
                (select id from categories where slug = ${category}))
        returning id, slug, type, title, excerpt, cover_image, status, published_at, ${category}::text as category
      ), j as (
        insert into translation_jobs (entity_type, entity_id, field_name, source_text, source_locale, status)
        select 'post', p.id, f.name, f.txt, 'uz', 'pending' from p, (values ('title', ${title}::text), ('content', ${content}::text)) as f(name, txt)
      )
      select * from p`;

    invalidate('posts');
    return NextResponse.json({
      success: true,
      post,
      message: "Post muvaffaqiyatli saqlandi",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

// Tahrirlash: PUT /api/posts?id=N  { title, excerpt, content, status, coverImage, category }
// Qoralama nashr qilinsa — nashr sanasi shu payt bo'ladi.
export async function PUT(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Post ID talab qilinadi' }, { status: 400 });
    const { title, excerpt, content, status = 'published', coverImage, category } = await req.json();
    if (!title || !content) return NextResponse.json({ error: 'Sarlavha va matn talab qilinadi' }, { status: 400 });
    if (!isCategorySlug(category)) {
      return NextResponse.json({ error: 'Turkumni tanlang (Olimpiada, Ta’lim, Tadbirlar yoki E’lonlar)' }, { status: 400 });
    }
    if (status !== 'published' && status !== 'draft') return NextResponse.json({ error: "Holat notöğri" }, { status: 400 });
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
    const [post] = await db`
      update posts set
        title = ${title},
        excerpt = ${excerpt || String(title).slice(0, 160)},
        content = ${content},
        status = ${status},
        cover_image = ${coverImage || null},
        category_id = (select id from categories where slug = ${category}),
        published_at = case when ${status} = 'published' and status <> 'published' then now() else published_at end,
        updated_at = now()
      where id = ${id}
      returning id, slug, type, title, excerpt, cover_image, status, published_at, ${category}::text as category`;
    if (!post) return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 });
    invalidate('posts');
    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Post ID talab qilinadi' }, { status: 400 });
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
    await db`delete from posts where id = ${id}`;
    invalidate('posts');
    return NextResponse.json({ success: true, message: "Post muvaffaqiyatli öçirildi" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}
