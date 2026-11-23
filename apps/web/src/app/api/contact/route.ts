import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/lib/db';
import { getAdmin } from '@/lib/admin-auth';

const contactSchema = z.object({
  fullName: z.string().min(3, "Ism-familiya kamida 3 belgidan iborat bölişi kerak"),
  phone: z.string().min(7, "Telefon raqam notöğri"),
  subject: z.string().min(2, "Mavzu kiritilişi şart"),
  message: z.string().min(5, "Xabar matni kamida 5 belgidan iborat bölişi kerak"),
});

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ messages: [], error: 'Ruxsat yöq' }, { status: 401 });
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ messages: [], error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
    const rows = await db`select * from contact_messages order by created_at desc`;
    return NextResponse.json({ messages: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err: any) {
    return NextResponse.json({ messages: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('contact_messages').insert({
        full_name: validated.fullName,
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message,
        status: 'new',
      });

      if (error) {
        console.error('Supabase contact insert error:', error);
        return NextResponse.json({ error: 'Murojaatni saqlab bölmadi' }, { status: 500 });
      }
      revalidateTag('admin');
    } else {
      return NextResponse.json({ error: 'Ma\'lumotlar bazasi ulanmagan' }, { status: 503 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Murojaatingiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan boğlanamiz!' 
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || "Ma'lumotlar notöğri" }, { status: 400 });
    }
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: 'Ruxsat yöq' }, { status: 401 });
  try {
    const { id, status } = await req.json();
    if (!id || !['new', 'read', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'ID va töğri status talab qilinadi' }, { status: 400 });
    }
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
    await db`update contact_messages set status = ${status} where id = ${id}`;
    revalidateTag('admin');
    return NextResponse.json({ success: true, message: 'Status yangilandi' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: 'Ruxsat yöq' }, { status: 401 });
  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Murojaat ID talab qilinadi' }, { status: 400 });
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
    await db`delete from contact_messages where id = ${id}`;
    revalidateTag('admin');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}
