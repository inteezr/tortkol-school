import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const SECRET = () => process.env.JWT_SECRET || '';
const sign = (p: string) => createHmac('sha256', SECRET()).update(p).digest('base64url');

export function createSessionToken(user: string) {
  const payload = Buffer.from(JSON.stringify({ user, role: 'superadmin', exp: Date.now() + 7 * 864e5 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string): { user: string } | null {
  if (!token || !SECRET()) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    return { user: data.user };
  } catch {
    return null;
  }
}

export async function getAdmin() {
  const c = await cookies();
  return verifySessionToken(c.get('admin_session')?.value);
}
