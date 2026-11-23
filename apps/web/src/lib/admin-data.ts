import 'server-only';
import { unstable_cache } from 'next/cache';
import { getDb } from './db';
import { toNewAlphabet } from './alphabet';

export type AdminData = {
  posts: any[];
  teachers: any[];
  leaders: any[];
  messages: any[];
  albums: any[];
  settings: { students: number; teachers: number; classes: number; photo: string };
};

const EMPTY: AdminData = { posts: [], teachers: [], leaders: [], messages: [], albums: [], settings: { students: 842, teachers: 89, classes: 37, photo: '' } };

/**
 * Admin paneli uchun BARCHA ma'lumot BITTA SQL so'rovda.
 * Baza uzoqda (har bir so'rov ~0.3-0.4 s), shuning uchun 6 ta alohida so'rov o'rniga 1 ta.
 * Ro'yxatlarda og'ir maydonlar (post matni) olinmaydi.
 */
export async function loadAdminData(): Promise<AdminData> {
  const db = getDb();
  if (!db) return EMPTY;
  const [row] = await db`
    select
      (select coalesce(json_agg(p), '[]'::json) from (
        select p.id, p.slug, p.type, p.title, p.excerpt, p.cover_image, p.status, p.published_at, c.slug as category
        from posts p left join categories c on c.id = p.category_id
        order by p.published_at desc nulls last, p.id desc limit 300) p) as posts,
      (select coalesce(json_agg(t), '[]'::json) from (
        select id, full_name, subject, category, experience, bio, education, achievements, photo_url, sort_order
        from teachers order by sort_order, id) t) as teachers,
      (select coalesce(json_agg(l), '[]'::json) from (
        select id, full_name, role, reception_days, phone, email, bio, photo_url, sort_order
        from leaders order by sort_order, id) l) as leaders,
      (select coalesce(json_agg(m), '[]'::json) from (
        select id, full_name, phone, subject, message, status, created_at
        from contact_messages order by created_at desc limit 300) m) as messages,
      (select coalesce(json_agg(a), '[]'::json) from (
        select al.id, al.slug, al.title, al.description, al.cover_image, al.created_at,
          coalesce((select json_agg(json_build_object('id', md.id, 'url', md.url) order by md.sort_order, md.id)
                    from media md where md.album_id = al.id and md.type = 'image'), '[]'::json) as media
        from albums al order by al.sort_order, al.id desc) a) as albums,
      (select coalesce(json_object_agg(key, value), '{}'::json) from site_settings
        where key in ('stat_students', 'stat_teachers', 'stat_classes', 'school_photo')) as settings`;
  const s = (row.settings || {}) as Record<string, string>;
  const num = (v: string | undefined, d: number) => (v !== undefined && v !== '' && !isNaN(+v) ? +v : d);
  // Admin panelda ham matnlar yangi alifboda ko'rinadi (faqat matn maydonlari)
  const fix = (list: any[], keys: string[]) =>
    (list || []).map((x) => { const y = { ...x }; for (const k of keys) if (typeof y[k] === 'string') y[k] = toNewAlphabet(y[k]); return y; });
  return {
    posts: fix(row.posts, ['title', 'excerpt']),
    teachers: fix(row.teachers, ['full_name', 'subject', 'bio', 'education', 'achievements']),
    leaders: fix(row.leaders, ['full_name', 'role', 'reception_days', 'bio']),
    messages: fix(row.messages, ['full_name', 'subject', 'message']),
    albums: fix(row.albums, ['title', 'description']),
    settings: {
      students: num(s.stat_students, EMPTY.settings.students),
      teachers: num(s.stat_teachers, EMPTY.settings.teachers),
      classes: num(s.stat_classes, EMPTY.settings.classes),
      photo: s.school_photo || '',
    },
  };
}

/**
 * Keshlangan variant: ikkinchi va keyingi ochilishlar bazaga bormaydi (0 ms).
 * Har bir o'zgartirish (post, xodim, galereya, murojaat, sozlama) `revalidateTag('admin')` chaqiradi.
 */
export const getAdminData = unstable_cache(loadAdminData, ['admin-data'], { revalidate: 300, tags: ['admin'] });
