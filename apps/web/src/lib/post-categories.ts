/**
 * Postlar turkumi (# teg). Bazadagi `categories` jadvalidagi slug'larga bog'langan;
 * saytda qisqa nom (Olimpiada, Ta'lim, ...) ko'rinadi. Admin post qo'shganda shulardan birini tanlaydi,
 * «Yangiliklar» sahifasida turkum bosilsa faqat shu turkumdagi postlar chiqadi (/news?tag=slug).
 */
export const POST_CATEGORIES = [
  { slug: 'yutuqlar', label: 'Olimpiada' },
  { slug: 'talim', label: "Ta'lim" },
  { slug: 'tadbir', label: 'Tadbirlar' },
  { slug: 'elonlar', label: 'E’lonlar' },
] as const;

export type PostCategorySlug = (typeof POST_CATEGORIES)[number]['slug'];

export const isCategorySlug = (v: unknown): v is PostCategorySlug =>
  typeof v === 'string' && POST_CATEGORIES.some((c) => c.slug === v);

/** Post obyektidan turkum (slug + qisqa nom). Turkumsiz eski postlar uchun null. */
export function postCategory(p: any): { slug: PostCategorySlug; label: string } | null {
  const slug = p?.categories?.slug ?? p?.category;
  const c = POST_CATEGORIES.find((x) => x.slug === slug);
  return c ? { slug: c.slug, label: c.label } : null;
}

export const newsTagHref = (slug: string) => `/news?tag=${slug}`;
