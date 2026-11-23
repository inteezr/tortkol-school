import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/admin-auth';
import { verifyLogin } from '@/lib/admin-store';


export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiritilişi şart' },
        { status: 400 }
      );
    }

    if (await verifyLogin(String(username).trim(), String(password))) {
      // 7 kunlik admin sessiya belgisi yaratish
      const sessionToken = createSessionToken(String(username).trim());

      const cookieStore = await cookies();
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 kun
      });

      return NextResponse.json({
        success: true,
        message: 'Tizimga muvaffaqiyatli kirildi',
      });
    }

    return NextResponse.json(
      { error: 'Login yoki parol notöğri!' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
