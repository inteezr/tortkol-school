import 'server-only';
import postgres from 'postgres';

// Faqat serverda ishlaydi (DATABASE_URL brauzerga chiqmaydi). RLS ni aylanib o'tadi,
// shuning uchun uni faqat admin sessiyasi tekshirilgan route'larda ishlating.

type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __sql?: Sql; __db?: Sql };

/** Bitta so'rov uchun eng ko'p kutish vaqti. Baza uzoqda (~0.4 s/so'rov), oddiy so'rov 1–3 s da tugaydi. */
const QUERY_TIMEOUT_MS = 12_000;

function createPool(url: string) {
  return postgres(url, {
    max: 3,
    prepare: false,
    connect_timeout: 10,
    // Uzoq turib qolgan ulanishlar tarmoq/pooler tomonidan jimgina uzilib qolishi mumkin:
    // ular tez yopiladi va vaqti-vaqti bilan yangilanadi, o'lik ulanish TCP keepalive bilan aniqlanadi.
    idle_timeout: 20,
    max_lifetime: 60 * 10,
    keep_alive: 30,
  });
}

/** Ulanishlar "osilib" qolganda: eski pool tashlanadi, keyingi so'rov yangi ulanish ochadi. */
function resetPool() {
  const old = g.__sql;
  g.__sql = undefined;
  old?.end({ timeout: 0 }).catch(() => {});
}

function withTimeout<T>(query: Promise<T> & { cancel?: () => void }): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      try { query.cancel?.(); } catch {}
      resetPool();
      reject(new Error("Ma'lumotlar bazasi javob bermadi. Bir ozdan keyin qayta urinib köring."));
    }, QUERY_TIMEOUT_MS);
  });
  return Promise.race([query, timeout]).finally(() => clearTimeout(timer));
}

/**
 * `db\`select ...\`` ko'rinishidagi har bir so'rov vaqt chegarasi bilan bajariladi (cheksiz kutib qolmaydi).
 * `db(qiymatlar)` kabi yordamchi chaqiruvlar o'zgarishsiz o'tadi.
 */
export function getDb(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const pool = () => (g.__sql ??= createPool(url));
  return (g.__db ??= new Proxy(function () {} as unknown as Sql, {
    apply(_t, _this, args: any[]) {
      const sql = pool() as any;
      const isQuery = Array.isArray(args[0]) && 'raw' in args[0];
      return isQuery ? withTimeout(sql(...args)) : sql(...args);
    },
    get(_t, prop) {
      const v = (pool() as any)[prop];
      return typeof v === 'function' ? v.bind(pool()) : v;
    },
  }));
}
