import 'server-only';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Admin o'zgarishidan keyin chaqiriladi: ma'lumot keshi + uni ishlatgan barcha sahifalar darhol yangilanadi.
 * (Netlify'da bu CDN keshini ham tozalaydi — eski ma'lumot saytda qolib ketmaydi.)
 * 'admin' — faqat admin paneli ma'lumoti (masalan murojaatlar), ommaviy sahifalarga tegmaydi.
 */
export function invalidate(...tags: string[]) {
  const all = new Set([...tags, 'admin']);
  all.forEach((t) => revalidateTag(t));
  if (tags.some((t) => t !== 'admin')) {
    revalidateTag('public');
    revalidatePath('/', 'layout');
  }
}
