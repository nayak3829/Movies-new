'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      setProgress(0);
      setVisible(true);

      if (timerRef.current) clearInterval(timerRef.current);

      let p = 0;
      timerRef.current = setInterval(() => {
        p += Math.random() * 20 + 5;
        if (p >= 90) {
          p = 90;
          if (timerRef.current) clearInterval(timerRef.current);
        }
        setProgress(p);
      }, 80);

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 300);
      }, 500);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-0.5 pointer-events-none">
      <div
        className="h-full bg-primary transition-all duration-200 ease-out shadow-[0_0_8px_rgba(229,9,20,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
