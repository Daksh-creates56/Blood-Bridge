'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export function ClickEffect() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((e: MouseEvent) => {
    const newRipple: Ripple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setRipples((prev) => [...prev, newRipple]);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', addRipple);
    return () => {
      document.removeEventListener('mousedown', addRipple);
    };
  }, [addRipple]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="click-ripple"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          onAnimationEnd={() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }}
        />
      ))}
    </div>
  );
}
