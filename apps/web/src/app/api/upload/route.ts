import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '@/lib/admin-auth';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';
import { r2Configured, r2Put } from '@/lib/r2';

const MAX = 2 * 1024 * 1024; // 2 MB

// Fayl turini kengaytmaga/MIME ga emas, haqiqiy baytlarga qarab aniqlaymiz.
function sniff(b: Buffer): string | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (b.length > 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  if (b.length > 6 && ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString())) return 'image/gif';
  return null;
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Ruxsat yöq" }, { status: 401 });
  const useR2 = r2Configured();
  const db = useR2 ? null : getDb(); // R2 bo'lsa baza kerak emas
  if (!useR2 && !db) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
  try {
    const file = (await req.formData()).get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Fayl tanlanmagan' }, { status: 400 });
    if (file.size > MAX) return NextResponse.json({ error: 'Rasm hajmi 2 MB dan oşmasligi kerak' }, { status: 413 });
    const buf = Buffer.from(await file.arrayBuffer());
    const type = sniff(buf);
    if (!type) return NextResponse.json({ error: 'Faqat JPG, PNG, WebP yoki GIF rasm yuklaş mumkin' }, { status: 415 });
    if (useR2) {
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[type]!;
      return NextResponse.json({ success: true, url: await r2Put(`uploads/${randomUUID()}.${ext}`, buf, type) });
    }
    const [row] = await db!`insert into uploads (content_type, size, data) values (${type}, ${buf.length}, ${buf}) returning id`;
    return NextResponse.json({ success: true, url: `/api/files/${row.id}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Yuklab bölmadi' }, { status: 500 });
  }
}
