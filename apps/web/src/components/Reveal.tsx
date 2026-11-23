import React from 'react';

/** Scroll paytida silliq chiqadigan blok (ScrollReveal tomonidan boshqariladi). */
export const Reveal: React.FC<{
  children: React.ReactNode;
  /** soniyada */
  delay?: number;
  from?: 'up' | 'down' | 'left' | 'right' | 'zoom';
  className?: string;
}> = ({ children, delay = 0, from = 'up', className }) => (
  <div className={className} data-reveal={from} data-reveal-delay={delay ? Math.round(delay * 1000) : undefined}>
    {children}
  </div>
);
