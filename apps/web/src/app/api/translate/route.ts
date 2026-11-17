import { NextRequest, NextResponse } from 'next/server';
import { TARGETS, TargetLocale, translateTexts } from '@/lib/translate-server';

export const maxDuration = 60;

// POST { locale: 'qq'|'ru'|'en', texts: string[] } -> { translations: (string|null)[] }
export async function POST(req: NextRequest) {
  try {
    const { locale, texts } = await req.json();
    if (!TARGETS.includes(locale) || !Array.isArray(texts)) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
    const clean: string[] = texts.slice(0, 40).map((t: unknown) => String(t ?? '').slice(0, 8000));
    const translations = await translateTexts(clean, locale as TargetLocale);
    return NextResponse.json({ translations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Xatolik' }, { status: 500 });
  }
}
