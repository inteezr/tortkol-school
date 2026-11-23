import React from 'react';
import { School } from 'lucide-react';

const bar = (w: string, h = 'h-4') => <div className={`adm-skel rounded-lg ${h} ${w}`} />;

/** Bo'lim yuklanayotganda ko'rinadi. */
export function TabSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="adm-skel rounded-2xl h-32" />)}
      </div>
      <div className="adm-skel rounded-2xl h-64" />
    </div>
  );
}

/** Ma'lumot bazadan kelguncha darhol ko'rsatiladigan to'liq qobiq: sahifa "bo'sh/oq" turmaydi. */
export function AdminShellSkeleton() {
  return (
    <div className="min-h-screen bg-[#E9EEF5] lg:p-4 lg:flex lg:gap-4">
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-white rounded-2xl border border-slate-200/70 p-3 h-[calc(100vh-2rem)]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#052659] to-[#5483B3] flex items-center justify-center text-white"><School className="w-5 h-5" /></div>
          <div className="space-y-1.5">{bar('w-24')}{bar('w-20', 'h-3')}</div>
        </div>
        <div className="mt-6 space-y-2.5 px-1">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="adm-skel rounded-xl h-10" />)}</div>
      </aside>
      <div className="flex-1 min-w-0 bg-[#F6F8FB] lg:rounded-2xl lg:border lg:border-slate-200/70 p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3"><div className="adm-skel rounded-full h-10 flex-1 max-w-md" /><div className="adm-skel rounded-full h-10 w-40 ml-auto" /></div>
        <div className="space-y-2">{bar('w-72', 'h-8')}{bar('w-56', 'h-4')}</div>
        <TabSkeleton />
      </div>
    </div>
  );
}
