import { createHash } from 'crypto';
import { getDb } from './db';

export type TargetLocale = 'qq' | 'ru' | 'en';
export const TARGETS: TargetLocale[] = ['qq', 'ru', 'en'];

const NAMES: Record<TargetLocale, string> = {
  qq: 'Karakalpak (Latin script, official 2016 alphabet: á ǵ ı ń ó ú sh ch)',
  ru: 'Russian',
  en: 'English',
};

const mem = new Map<string, string>();
const keyOf = (text: string, locale: string) => createHash('sha1').update(`${locale}|${text}`).digest('hex');

let tableReady: Promise<void> | null = null;
function ensureTable() {
  const db = getDb();
  if (!db) return null;
  tableReady ??= db`create table if not exists text_cache (
    hash char(40) primary key, locale varchar(5) not null, translated text not null, created_at timestamptz default now())`
    .then(() => undefined)
    .catch((e: any) => { console.error('text_cache:', e.message); tableReady = null; });
  return tableReady;
}

async function readCache(hashes: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const db = getDb();
  const ready = ensureTable();
  if (!db || !ready) return out;
  try {
    await ready;
    const rows = await db`select hash, translated from text_cache where hash in ${db(hashes)}`;
    for (const r of rows) out.set(r.hash, r.translated);
  } catch (e: any) { console.error('cache read:', e.message); }
  return out;
}

async function writeCache(items: { hash: string; locale: string; text: string }[]) {
  const db = getDb();
  const ready = ensureTable();
  if (!db || !ready || !items.length) return;
  try {
    await ready;
    await db`insert into text_cache ${db(items.map(i => ({ hash: i.hash, locale: i.locale, translated: i.text })))} on conflict (hash) do nothing`;
  } catch (e: any) { console.error('cache write:', e.message); }
}

// ---------- Provayderlar ----------

async function viaGemini(texts: string[], locale: TargetLocale): Promise<string[] | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `You translate website content of an Uzbek school from Uzbek into ${NAMES[locale]}. Input is a JSON array of strings. Return ONLY a JSON array of the same length with the translations, same order. Keep names of people, numbers, emails, phone numbers and URLs unchanged. The school name \"To‘rtko‘l tuman ixtisoslashtirilgan maktabi\" (also written To'rtko'l) must always stay exactly as is, never translated or transliterated. Keep line breaks. Do not add commentary.` }] },
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(texts) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const raw: string = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
  const arr = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
  if (!Array.isArray(arr) || arr.length !== texts.length) throw new Error('Gemini: noto‘g‘ri javob');
  return arr.map(String);
}

async function viaClaude(texts: string[], locale: TargetLocale): Promise<string[] | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.TRANSLATE_MODEL || 'claude-haiku-5-5',
      max_tokens: 8000,
      system: `You translate website content of an Uzbek school from Uzbek into ${NAMES[locale]}. Input is a JSON array of strings. Return ONLY a JSON array of the same length with the translations, same order. Keep names of people, numbers, emails, phone numbers and URLs unchanged. The school name \"To‘rtko‘l tuman ixtisoslashtirilgan maktabi\" (also written To'rtko'l) must always stay exactly as is, never translated or transliterated. Keep line breaks. Do not add commentary.`,
      messages: [{ role: 'user', content: JSON.stringify(texts) }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}`);
  const data = await res.json();
  const raw: string = data.content?.[0]?.text || '';
  const arr = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
  if (!Array.isArray(arr) || arr.length !== texts.length) throw new Error('Claude: noto‘g‘ri javob');
  return arr.map(String);
}

const CYR2LAT: Record<string, string> = {
  а: 'a', ә: 'á', б: 'b', в: 'w', г: 'g', ғ: 'ǵ', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'ı', к: 'k', қ: 'q', л: 'l', м: 'm',
  н: 'n', ң: 'ń', о: 'o', ө: 'ó', п: 'p', р: 'r', с: 's', т: 't', у: 'ıw', ұ: 'u', ү: 'ú', ф: 'f', х: 'x', һ: 'h', ц: 's', ч: 'ch',
  ш: 'sh', щ: 'sh', ъ: '', ы: 'ı', і: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
const translit = (s: string) =>
  s.replace(/[А-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё]/g, (c) => {
    const l = CYR2LAT[c.toLowerCase()] ?? c;
    return c === c.toLowerCase() ? l : l.charAt(0).toUpperCase() + l.slice(1);
  });

function chunk(text: string, max = 450): string[] {
  if (text.length <= max) return [text];
  const parts = text.match(/[^.!?\n]+[.!?]*\s*|\n+/g) || [text];
  const out: string[] = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + p).length > max && cur) { out.push(cur); cur = ''; }
    if (p.length > max) { for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max)); } else cur += p;
  }
  if (cur) out.push(cur);
  return out;
}

async function myMemory(text: string, locale: TargetLocale): Promise<string> {
  const target = locale === 'qq' ? 'kk' : locale; // MyMemory qoraqalpoq tilini bilmaydi: qozoq tili + lotin yozuviga o‘tkazish
  const pieces = chunk(text);
  const out: string[] = [];
  for (const piece of pieces) {
    if (!/\p{L}/u.test(piece)) { out.push(piece); continue; }
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(piece)}&langpair=uz|${target}`);
    const data = await res.json();
    const tr: string = data?.responseData?.translatedText;
    if (!res.ok || data?.responseStatus !== 200 || !tr || /INVALID|QUERY LENGTH|MYMEMORY WARNING/i.test(tr)) throw new Error(`MyMemory: ${data?.responseDetails || res.status}`);
    out.push(tr);
  }
  const joined = out.join('');
  return locale === 'qq' ? translit(joined) : joined;
}

async function translateMany(texts: string[], locale: TargetLocale): Promise<(string | null)[]> {
  try {
    const viaAi = (await viaGemini(texts, locale)) ?? (await viaClaude(texts, locale));
    if (viaAi) return viaAi;
  } catch (e: any) { console.error('AI translate:', e.message); }
  const out: (string | null)[] = [];
  for (const t of texts) {
    try { out.push(await myMemory(t, locale)); } catch (e: any) { console.error(e.message); out.push(null); }
  }
  return out;
}

/** Matnlarni locale ga tarjima qiladi. Topilmaganlari null (asl matn ko‘rsatiladi, keshlanmaydi). */
export async function translateTexts(texts: string[], locale: TargetLocale): Promise<(string | null)[]> {
  const hashes = texts.map((t) => keyOf(t, locale));
  const result: (string | null)[] = texts.map((_, i) => mem.get(hashes[i]) ?? null);
  const missingIdx = result.map((r, i) => (r === null ? i : -1)).filter((i) => i >= 0);
  if (!missingIdx.length) return result;

  const cached = await readCache(missingIdx.map((i) => hashes[i]));
  const toDo: number[] = [];
  for (const i of missingIdx) {
    const c = cached.get(hashes[i]);
    if (c !== undefined) { result[i] = c; mem.set(hashes[i], c); } else toDo.push(i);
  }
  if (!toDo.length) return result;

  const fresh = await translateMany(toDo.map((i) => texts[i]), locale);
  const save: { hash: string; locale: string; text: string }[] = [];
  toDo.forEach((i, k) => {
    const v = fresh[k];
    if (v) { result[i] = v; mem.set(hashes[i], v); save.push({ hash: hashes[i], locale, text: v }); }
  });
  await writeCache(save);
  return result;
}
