import 'server-only';
import postgres from 'postgres';

// Faqat serverda ishlaydi (DATABASE_URL brauzerga chiqmaydi). RLS ni aylanib o'tadi,
// shuning uchun uni faqat admin sessiyasi tekshirilgan route'larda ishlating.
const g = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return (g.__sql ??= postgres(url, { max: 5, prepare: false }));
}
