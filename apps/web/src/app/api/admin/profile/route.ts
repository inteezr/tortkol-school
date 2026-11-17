import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getAdmin, createSessionToken } from '@/lib/admin-auth';
import { updateProfile } from '@/lib/admin-store';

const schema = z.object({
  currentPassword: z.string().min(1, 'Joriy parolni kiriting'),
  newUsername: z.string().trim().min(3, 'Login kamida 3 belgi').max(50).regex(/^[a-zA-Z0-9_.-]+$/, 'Loginda faqat lotin harf, raqam, _ . - bo\'lishi mumkin').optional(),
  newPassword: z.string().min(8, 'Yangi parol kamida 8 belgi').max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  try {
    const body = schema.parse(await req.json());
    if (!body.newUsername && !body.newPassword) {
      return NextResponse.json({ error: "O'zgartirish uchun yangi login yoki parol kiriting" }, { status: 400 });
    }
    const username = await updateProfile({ username: admin.user }, body.currentPassword, body.newUsername, body.newPassword);
    (await cookies()).set('admin_session', createSessionToken(username), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ success: true, message: 'Profil yangilandi', user: { username } });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    const dup = /unique|duplicate/i.test(err.message || '');
    return NextResponse.json({ error: dup ? 'Bu login band' : err.message || 'Server xatoligi' }, { status: dup ? 409 : 400 });
  }
}
