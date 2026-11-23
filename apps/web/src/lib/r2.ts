import 'server-only';
import { createHash, createHmac } from 'crypto';

// Cloudflare R2 (S3-mos) ga rasm yozish. Kutubxonasiz: AWS SigV4 imzosi.
// Kerakli env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
export const r2Configured = () =>
  Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET && process.env.R2_PUBLIC_URL);

const hmac = (k: Buffer | string, d: string) => createHmac('sha256', k).update(d).digest();
const sha = (d: Buffer | string) => createHash('sha256').update(d).digest('hex');

async function signedFetch(method: 'PUT' | 'DELETE', key: string, body?: Buffer, contentType?: string) {
  const acct = process.env.R2_ACCOUNT_ID!, bucket = process.env.R2_BUCKET!;
  const host = `${acct}.r2.cloudflarestorage.com`;
  const path = `/${bucket}/${key.split('/').map(encodeURIComponent).join('/')}`;
  const now = new Date();
  const amz = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // 20260101T000000Z
  const date = amz.slice(0, 8);
  const payloadHash = sha(body ?? '');
  const headers: Record<string, string> = { host, 'x-amz-content-sha256': payloadHash, 'x-amz-date': amz };
  if (contentType) { headers['content-type'] = contentType; headers['cache-control'] = 'public, max-age=31536000, immutable'; }
  const names = Object.keys(headers).sort();
  const canonical = [method, path, '', names.map((n) => `${n}:${headers[n]}\n`).join(''), names.join(';'), payloadHash].join('\n');
  const scope = `${date}/auto/s3/aws4_request`;
  const toSign = ['AWS4-HMAC-SHA256', amz, scope, sha(canonical)].join('\n');
  const kSigning = hmac(hmac(hmac(hmac('AWS4' + process.env.R2_SECRET_ACCESS_KEY!, date), 'auto'), 's3'), 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(toSign).digest('hex');
  const auth = `AWS4-HMAC-SHA256 Credential=${process.env.R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${names.join(';')}, Signature=${signature}`;
  const res = await fetch(`https://${host}${path}`, {
    method,
    headers: { ...headers, Authorization: auth },
    body: body ? new Uint8Array(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`R2 xatosi ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

export const publicUrl = (key: string) => `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}`;

/** Faylni R2 ga yozadi va ommaviy URL qaytaradi. */
export async function r2Put(key: string, body: Buffer, contentType: string) {
  await signedFetch('PUT', key, body, contentType);
  return publicUrl(key);
}
export async function r2Delete(key: string) { await signedFetch('DELETE', key); }
