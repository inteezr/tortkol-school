import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  if (!UUID.test(id) || !db) return new NextResponse('Not found', { status: 404 });
  const [row] = await db`select content_type, data from uploads where id = ${id}`;
  if (!row) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      'Content-Type': row.content_type,
      'Content-Length': String(row.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable', // id o'zgarmas, rasm almashtirilsa yangi id
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
