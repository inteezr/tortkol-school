import 'server-only';
import { unstable_cache } from 'next/cache';
import { getDb } from './db';
import { supabase } from './supabase';

/**
 * Ommaviy sayt uchun BARCHA ma'lumot (yangiliklar ro'yxati, rahbariyat, o'qituvchilar, galereya, sozlamalar).
 *
 * Nega shunday: baza uzoqda (Sidney) — har bir so'rov 0.4–3 s. Shuning uchun ma'lumot sahifa
 * yaratilayotganda serverda BIR MARTA olinadi va HTML ichiga qo'shiladi; tashrif buyuruvchi
 * bazani kutmaydi. Admin biror narsani o'zgartirsa `invalidatePublic()` keshni va sahifalarni
 * darhol yangilaydi (Netlify CDN ham tozalanadi).
 */

export type SiteSettings = { students: number; teachers: number; classes: number; photo: string };
export type PublicData = {
  posts: any[];
  leaders: any[];
  teachers: any[];
  albums: any[];
  settings: SiteSettings;
};

export const DEFAULT_SETTINGS: SiteSettings = { students: 842, teachers: 89, classes: 37, photo: '' };
const SETTING_KEYS = ['stat_students', 'stat_teachers', 'stat_classes', 'school_photo'];

/** Teglar: har biri o'zgarganda shu ma'lumot va uni ishlatgan barcha sahifalar yangilanadi. */
export const PUBLIC_TAGS = ['public', 'posts', 'staff', 'gallery', 'site-settings'] as const;

function toSettings(s: Record<string, string>): SiteSettings {
  const num = (v: string | undefined, d: number) => (v !== undefined && v !== '' && !isNaN(+v) ? +v : d);
  return {
    students: num(s.stat_students, DEFAULT_SETTINGS.students),
    teachers: num(s.stat_teachers, DEFAULT_SETTINGS.teachers),
    classes: num(s.stat_classes, DEFAULT_SETTINGS.classes),
    photo: s.school_photo || DEFAULT_SETTINGS.photo,
  };
}

/** To'g'ridan-to'g'ri Postgres: hammasi bitta so'rovda (bitta tarmoq aylanishi). RLS qoidalari qo'lda takrorlangan. */
async function loadViaDb(): Promise<PublicData> {
  const db = getDb()!;
  const [row] = await db`
    select
      (select coalesce(json_agg(p), '[]'::json) from (
        select p.id, p.slug, p.type, p.title, p.excerpt, p.cover_image, p.status, p.published_at,
               case when c.id is null then null else json_build_object('name', c.name, 'slug', c.slug) end as categories
        from posts p left join categories c on c.id = p.category_id
        where p.status = 'published' and p.deleted_at is null
        order by p.published_at desc nulls last, p.id desc limit 200) p) as posts,
      (select coalesce(json_agg(l), '[]'::json) from (
        select id, full_name, role, reception_days, phone, email, bio, photo_url, sort_order
        from leaders order by sort_order, id) l) as leaders,
      (select coalesce(json_agg(t), '[]'::json) from (
        select id, full_name, subject, category, experience, bio, education, achievements, photo_url, sort_order
        from teachers order by sort_order, id) t) as teachers,
      (select coalesce(json_agg(a), '[]'::json) from (
        select al.id, al.slug, al.title, al.description, al.cover_image, al.created_at,
          coalesce((select json_agg(json_build_object('id', md.id, 'url', md.url, 'title', md.title, 'sort_order', md.sort_order, 'type', md.type)
                      order by md.sort_order, md.id)
                    from media md where md.album_id = al.id and md.type = 'image'), '[]'::json) as media
        from albums al order by al.sort_order, al.id desc) a) as albums,
      (select coalesce(json_object_agg(key, value), '{}'::json) from site_settings where key = any(${SETTING_KEYS})) as settings`;
  return { posts: row.posts, leaders: row.leaders, teachers: row.teachers, albums: row.albums, settings: toSettings(row.settings || {}) };
}

/** DATABASE_URL bo'lmasa: Supabase REST (anon kalit, RLS bilan). */
async function loadViaSupabase(): Promise<PublicData> {
  const sb = supabase!;
  const sig = () => AbortSignal.timeout(9000);
  const [posts, leaders, teachers, albums, settings] = await Promise.all([
    sb.from('posts').select('id, slug, type, title, excerpt, cover_image, status, published_at, categories(name, slug)').eq('status', 'published').order('published_at', { ascending: false }).limit(200).abortSignal(sig()),
    sb.from('leaders').select('id, full_name, role, reception_days, phone, email, bio, photo_url, sort_order').order('sort_order').abortSignal(sig()),
    sb.from('teachers').select('id, full_name, subject, category, experience, bio, education, achievements, photo_url, sort_order').order('sort_order').abortSignal(sig()),
    sb.from('albums').select('id, slug, title, description, cover_image, created_at, media(id, url, title, sort_order, type)').order('sort_order').order('id', { ascending: false }).abortSignal(sig()),
    sb.from('site_settings').select('key,value').in('key', SETTING_KEYS).abortSignal(sig()),
  ]);
  const err = [posts, leaders, teachers, albums, settings].find((r) => r.error)?.error;
  if (err) throw new Error(err.message);
  const s: Record<string, string> = {};
  (settings.data || []).forEach((r: any) => (s[r.key] = r.value));
  return {
    posts: posts.data || [],
    leaders: leaders.data || [],
    teachers: teachers.data || [],
    albums: (albums.data || []).map((a: any) => ({
      ...a,
      media: (a.media || []).filter((m: any) => m.type === 'image').sort((x: any, y: any) => x.sort_order - y.sort_order || x.id - y.id),
    })),
    settings: toSettings(s),
  };
}

async function loadPublicData(): Promise<PublicData> {
  if (getDb()) return loadViaDb();
  if (supabase) return loadViaSupabase();
  return { posts: [], leaders: [], teachers: [], albums: [], settings: DEFAULT_SETTINGS };
}

/**
 * Keshlangan: xato bo'lsa throw (unstable_cache xatoni keshlamaydi).
 * revalidate — faqat zaxira; asosiy yangilanish admin o'zgarishidagi teglar orqali darhol bo'ladi.
 */
export const getPublicData = unstable_cache(loadPublicData, ['public-data-v1'], { revalidate: 3600, tags: [...PUBLIC_TAGS] });

/** Sahifalar uchun xavfsiz variant: baza javob bermasa null (sahifa baribir chiqadi, brauzer API'dan oladi). */
export async function getPublicDataSafe(): Promise<PublicData | null> {
  try {
    return await getPublicData();
  } catch (e: any) {
    console.error('public data load error:', e?.message);
    return null;
  }
}

/** Bitta yangilik to'liq matni bilan (slug bo'yicha). */
export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    const db = getDb();
    if (db) {
      const [p] = await db`
        select p.*, case when c.id is null then null else json_build_object('name', c.name, 'slug', c.slug) end as categories
        from posts p left join categories c on c.id = p.category_id
        where p.slug = ${slug} and p.status = 'published' and p.deleted_at is null limit 1`;
      return p ? JSON.parse(JSON.stringify(p)) : null;
    }
    if (!supabase) return null;
    const { data, error } = await supabase.from('posts').select('*, categories(name, slug)').eq('status', 'published').eq('slug', slug).limit(1).abortSignal(AbortSignal.timeout(9000));
    if (error) throw new Error(error.message);
    return data?.[0] ?? null;
  },
  ['post-by-slug-v1'],
  { revalidate: 3600, tags: ['public', 'posts'] }
);
