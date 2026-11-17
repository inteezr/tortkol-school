import { NextRequest, NextResponse } from 'next/server';

// /admin faqat imzolangan sessiya bilan ochiladi, aks holda to'g'ridan-to'g'ri login sahifasi.
async function valid(token?: string) {
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
  const expected = btoa(String.fromCharCode(...mac)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (expected !== sig) return false;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ok = await valid(req.cookies.get('admin_session')?.value);
  if (pathname === '/admin' && !ok) return NextResponse.redirect(new URL('/admin/login', req.url));
  if (pathname === '/admin/login' && ok) return NextResponse.redirect(new URL('/admin', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/login'] };
