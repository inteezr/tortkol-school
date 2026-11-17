import 'server-only';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { getDb } from './db';

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(pw, salt, 64).toString('hex')}`;
}

export function checkPassword(pw: string, stored: string) {
  const [alg, salt, hash] = stored.split('$');
  if (alg !== 'scrypt' || !salt || !hash) return false;
  const a = Buffer.from(hash, 'hex');
  const b = scryptSync(pw, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Login tekshiruvi: admin_account jadvali bo'lsa shu, bo'lmasa .env (ADMIN_USERNAME/PASSWORD). */
export async function verifyLogin(username: string, password: string): Promise<boolean> {
  const db = getDb();
  if (db) {
    const rows = await db`select username, password_hash from admin_account order by id limit 1`;
    if (rows.length) return safeEq(rows[0].username, username) && checkPassword(password, rows[0].password_hash);
  }
  const u = process.env.ADMIN_USERNAME, p = process.env.ADMIN_PASSWORD;
  return !!u && !!p && safeEq(u, username) && safeEq(p, password);
}

export async function updateProfile(current: { username: string }, currentPassword: string, newUsername?: string, newPassword?: string) {
  const db = getDb();
  if (!db) throw new Error('DATABASE_URL sozlanmagan');
  if (!(await verifyLogin(current.username, currentPassword))) throw new Error('Joriy parol noto\'g\'ri');
  const username = (newUsername || current.username).trim();
  const hash = newPassword ? hashPassword(newPassword) : null;
  const rows = await db`select id, password_hash from admin_account order by id limit 1`;
  if (rows.length) {
    await db`update admin_account set username = ${username}, password_hash = ${hash ?? rows[0].password_hash}, updated_at = now() where id = ${rows[0].id}`;
  } else {
    // .env dan DB ga ko'chirish
    await db`insert into admin_account (username, password_hash) values (${username}, ${hash ?? hashPassword(currentPassword)})`;
  }
  return username;
}
