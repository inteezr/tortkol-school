// Bazadagi eski rasmlarni (uploads jadvali) R2 ga ko'chiradi va barcha havolalarni yangilaydi.
// Ishga tushirish:  node --env-file=apps/web/.env.local scripts/migrate-uploads-to-r2.mjs [--apply]
// --apply bo'lmasa faqat nima qilinishini ko'rsatadi (hech narsa o'zgarmaydi).
import postgres from '../apps/web/node_modules/postgres/src/index.js';
import { createHash, createHmac, randomUUID } from 'crypto';

const e = process.env, apply = process.argv.includes('--apply');
for (const k of ['DATABASE_URL','R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY','R2_BUCKET','R2_PUBLIC_URL']) if (!e[k]) { console.error('Yetishmayapti:', k); process.exit(1); }
const sql = postgres(e.DATABASE_URL, { max: 1, prepare: false });
const hm = (k, d) => createHmac('sha256', k).update(d).digest(); const sh = (d) => createHash('sha256').update(d).digest('hex');

async function put(key, body, type) {
  const host = `${e.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, path = `/${e.R2_BUCKET}/${key}`;
  const amz = new Date().toISOString().replace(/[:-]|\.\d{3}/g, ''), date = amz.slice(0, 8), ph = sh(body);
  const h = { 'cache-control': 'public, max-age=31536000, immutable', 'content-type': type, host, 'x-amz-content-sha256': ph, 'x-amz-date': amz };
  const names = Object.keys(h).sort();
  const canon = ['PUT', path, '', names.map((n) => `${n}:${h[n]}\n`).join(''), names.join(';'), ph].join('\n');
  const scope = `${date}/auto/s3/aws4_request`;
  const sig = createHmac('sha256', hm(hm(hm(hm('AWS4' + e.R2_SECRET_ACCESS_KEY, date), 'auto'), 's3'), 'aws4_request')).update(['AWS4-HMAC-SHA256', amz, scope, sh(canon)].join('\n')).digest('hex');
  const r = await fetch(`https://${host}${path}`, { method: 'PUT', body, headers: { ...h, Authorization: `AWS4-HMAC-SHA256 Credential=${e.R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${names.join(';')}, Signature=${sig}` } });
  if (!r.ok) throw new Error(`R2 ${r.status}: ${await r.text()}`);
}

const rows = await sql`select id, content_type, data from uploads`;
console.log(`${rows.length} ta rasm topildi${apply ? '' : ' (sinov rejimi, --apply bilan haqiqatan ko\'chiriladi)'}`);
const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
// URL saqlanadigan ustunlar
const targets = [['teachers','photo_url'],['leaders','photo_url'],['posts','cover_image'],['albums','cover_image'],['media','url']];
for (const r of rows) {
  const key = `uploads/${randomUUID()}.${ext[r.content_type] || 'bin'}`, oldUrl = `/api/files/${r.id}`, newUrl = `${e.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  console.log(oldUrl, '->', newUrl);
  if (!apply) continue;
  await put(key, r.data, r.content_type);
  for (const [t, c] of targets) await sql`update ${sql(t)} set ${sql(c)} = ${newUrl} where ${sql(c)} = ${oldUrl}`;
  await sql`update site_settings set value = ${newUrl} where value = ${oldUrl}`;
}
if (apply) console.log('Tayyor. Hammasi to\'g\'ri ko\'ringach "uploads" jadvalidagi eski qatorlarni o\'zingiz o\'chirasiz (men o\'chirmadim).');
await sql.end();
