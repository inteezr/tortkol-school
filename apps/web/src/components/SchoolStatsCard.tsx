'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { School, GraduationCap, Users, LayoutGrid } from 'lucide-react';
import { useApiJson } from '../lib/api-store';
import { useLanguage } from '../lib/LanguageContext';

type Settings = { students: number; teachers: number; classes: number; photo: string };

const FALLBACK: Settings = { students: 842, teachers: 89, classes: 37, photo: '' };

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{val}</span>;
}

export const SchoolStatsCard: React.FC = () => {
  const { tr } = useLanguage();
  const reduce = useReducedMotion();
  // Server sahifa bilan yuborgan sozlamalar (admin o'zgartirsa darhol yangilanadi)
  const s = useApiJson<Settings>('/api/site-settings').data ?? FALLBACK;

  const stats = [
    { icon: GraduationCap, value: s.students, label: tr("Öquvçilar") },
    { icon: Users, value: s.teachers, label: tr("Öqituvçilar") },
    { icon: LayoutGrid, value: s.classes, label: tr('Sinflar') },
  ];

  return (
    <div className="w-full">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl min-h-[320px] lg:min-h-[400px] bg-gradient-to-br from-[#021024] via-[#031A3F] to-[#052659] shadow-2xl shadow-sky-900/15 flex items-end"
        >
          {s?.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={s.photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <School className="absolute right-10 top-10 w-40 h-40 text-white/15" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

          <div className="relative w-full p-3 sm:p-4 grid grid-cols-3 gap-2 sm:gap-3">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl bg-white/15 backdrop-blur-xl border border-white/25 px-3 py-3 sm:px-4 sm:py-4 text-white hover:bg-white/25 hover:-translate-y-1 transition-all duration-500"
              >
                <Icon className="w-4 h-4 text-sky-100 mb-2" />
                <div className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums"><Counter to={value} /></div>
                <div className="mt-0.5 text-[11px] sm:text-xs font-medium text-sky-50">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
    </div>
  );
};
