// O'zbek lotin alifbosining takomillashtirilgan loyihasi:
//   G‘ g‘ → Ğ ğ,  O‘ o‘ → Ö ö,  Sh sh → Ş ş,  Ch ch → Ç ç
// toNewAlphabet — ekranga chiqariladigan o'zbekcha matn uchun.
// toOldAlphabet — teskari o'tkazish (lug'at kalitlari va tarjima xizmatlari eski yozuvni kutadi).

const APOS = "['‘’ʻʼ`´]";

// O'zgartirilmaydigan bo'laklar: URL, email, domen, @handle.
const PROTECTED = /(https?:\/\/\S+|www\.\S+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|@[\w.]+|\b[\w-]+(?:\.[\w-]+)*\.(?:uz|com|ru|org|net|io|dev|app)\b\S*)/gi;

// Matn ichida uchrashi mumkin bo'lgan inglizcha/xorijiy so'zlar — sh/ch bu yerda alohida tovush emas.
const FOREIGN = new Set([
  'dashboard', 'push', 'flash', 'english', 'shift', 'show', 'share', 'school', 'tech', 'search', 'chrome', 'cache',
  'microsoft', 'whatsapp', 'refresh', 'fetch', 'match', 'chat', 'touch', 'switch', 'batch', 'patch', 'fashion',
]);

const isUpper = (c: string | undefined) => !!c && c !== c.toLowerCase() && c === c.toUpperCase();

function convertWord(w: string): string {
  if (FOREIGN.has(w.toLowerCase())) return w;
  return w
    .replace(new RegExp(`([Gg])${APOS}`, 'g'), (_, g) => (g === 'G' ? 'Ğ' : 'ğ'))
    .replace(new RegExp(`([Oo])${APOS}(?=\\p{L})`, 'gu'), (_, o) => (o === 'O' ? 'Ö' : 'ö'))
    .replace(/([Ss])([Hh])/g, (_, s) => (s === 'S' ? 'Ş' : 'ş'))
    .replace(/([Cc])([Hh])/g, (_, c) => (c === 'C' ? 'Ç' : 'ç'));
}

function convertPlain(s: string): string {
  // So'z = harflar + so'z ichidagi apostroflar (o‘g‘il, ma'lumot)
  return s.replace(new RegExp(`\\p{L}(?:\\p{L}|${APOS}(?=\\p{L})|(?<=[Gg])${APOS})*`, 'gu'), convertWord);
}

function mapUnprotected(s: string, fn: (x: string) => string): string {
  let out = '';
  let last = 0;
  for (const m of s.matchAll(PROTECTED)) {
    out += fn(s.slice(last, m.index)) + m[0];
    last = m.index! + m[0].length;
  }
  return out + fn(s.slice(last));
}

export function toNewAlphabet(s: string): string;
export function toNewAlphabet(s: string | null | undefined): string | null | undefined;
export function toNewAlphabet(s: string | null | undefined) {
  if (!s || !/[gGoOsScC]/.test(s)) return s;
  return mapUnprotected(s, convertPlain);
}

export function toOldAlphabet(s: string): string;
export function toOldAlphabet(s: string | null | undefined): string | null | undefined;
export function toOldAlphabet(s: string | null | undefined) {
  if (!s || !/[ĞğÖöŞşÇç]/.test(s)) return s;
  return s.replace(/[ĞğÖöŞşÇç]/g, (c, i: number) => {
    const nextUpper = isUpper(s[i + 1]);
    switch (c) {
      case 'Ğ': return 'G‘';
      case 'ğ': return 'g‘';
      case 'Ö': return 'O‘';
      case 'ö': return 'o‘';
      case 'Ş': return nextUpper ? 'SH' : 'Sh';
      case 'ş': return 'sh';
      case 'Ç': return nextUpper ? 'CH' : 'Ch';
      default: return 'ch';
    }
  });
}

/** Obyekt/massivdagi barcha satrlarni yangi alifboga o'tkazadi (lug'atlar uchun). */
export function deepToNew<T>(v: T): T {
  if (typeof v === 'string') return toNewAlphabet(v) as T;
  if (Array.isArray(v)) return v.map(deepToNew) as T;
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepToNew(x)])) as T;
  }
  return v;
}

/** Boshqa tillardagi matnlarda ham maktab nomi yangi alifboda yoziladi. */
export function fixSchoolName(s: string): string {
  return s
    .replace(/To['‘’ʻʼ`´]rtko['‘’ʻʼ`´]l/g, 'Törtköl')
    .replace(/(Törtköl tuman) ixtisoslashtirilgan/g, '$1 ixtisoslaştirilgan');
}
