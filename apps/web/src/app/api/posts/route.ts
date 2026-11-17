import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache, revalidateTag } from 'next/cache';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';

const CACHE = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

const fetchPosts = unstable_cache(
  async (type: string | null, slug: string | null) => {
    if (!supabase) return { posts: [] as any[], error: null as string | null };
    // Ro'yxat uchun to'liq matn (content) kerak emas — faqat bitta maqola ochilganda olinadi
    const cols = slug ? '*, categories(name)' : 'id, slug, type, title, excerpt, cover_image, status, published_at, categories(name)';
    let query = supabase.from('posts').select(cols).eq('status', 'published');
    if (type) query = query.eq('type', type);
    if (slug) query = query.eq('slug', slug);
    const { data, error } = await query.order('published_at', { ascending: false });
    return { posts: data || [], error: error?.message ?? null };
  },
  ['posts'],
  { revalidate: 300, tags: ['posts'] }
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ posts: [], isLiveDatabase: false }, { headers: CACHE });
    }
    const { posts, error } = await fetchPosts(searchParams.get('type'), searchParams.get('slug'));
    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ posts: [], error }, { status: 500 });
    }
    return NextResponse.json({ posts }, { headers: CACHE });
  } catch {
    return NextResponse.json({ posts: [], error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  try {
    const body = await req.json();
    const { title, excerpt, content, type = 'news', status = 'published', coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Sarlavha va matn talab qilinadi' }, { status: 400 });
    }
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-6);

    const [post] = await db`
      insert into posts (slug, title, excerpt, content, type, status, cover_image, published_at)
      values (${slug}, ${title}, ${excerpt || title.slice(0, 160)}, ${content}, ${type}, ${status}, ${coverImage || null}, now())
      returning *`;

    await db`
      insert into translation_jobs (entity_type, entity_id, field_name, source_text, source_locale, status)
      values ('post', ${post.id}, 'title', ${title}, 'uz', 'pending'),
             ('post', ${post.id}, 'content', ${content}, 'uz', 'pending')`;

    revalidateTag('posts');
    return NextResponse.json({
      success: true,
      post,
      message: "Post muvaffaqiyatli saqlandi va avto-tarjima navbatiga qo'shildi!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Post ID talab qilinadi' }, { status: 400 });
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
    await db`delete from posts where id = ${id}`;
    revalidateTag('posts');
    return NextResponse.json({ success: true, message: "Post muvaffaqiyatli o'chirildi" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}
