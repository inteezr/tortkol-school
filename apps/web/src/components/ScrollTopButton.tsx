'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/** Pastki o'ng burchakdagi "yuqoriga" tugmasi — scroll qilinganda silliq paydo bo'ladi. */
export function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      type="button"
      aria-label="Yuqoriga"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-[#1F6FEB] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-[#052659] hover:-translate-y-1 hover:scale-110 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
