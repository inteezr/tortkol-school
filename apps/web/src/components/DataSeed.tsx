'use client';

import { useRef } from 'react';
import { seedJson } from '../lib/api-store';

/**
 * Server sahifa bilan birga yuborgan ma'lumotni brauzer keshiga qo'yadi — sahifalar
 * API'ga so'rov yubormasdan darhol ko'rsatadi. Bolalar render bo'lishidan OLDIN ishlaydi.
 */
export function DataSeed({ entries, children }: { entries: Record<string, any> | null; children: React.ReactNode }) {
  const done = useRef<Record<string, any> | null>(null);
  if (entries && done.current !== entries) {
    seedJson(entries);
    done.current = entries;
  }
  return <>{children}</>;
}
