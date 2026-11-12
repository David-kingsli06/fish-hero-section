'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '@/lib/foldwild-data';
import { computeViewportMetrics, ViewportMetrics } from '@/lib/viewport';
import { Logo } from './Logo';
import { HomeStage } from './HomeStage';

export const FoldwildApp: React.FC = () => {
  const [metrics, setMetrics] = useState<ViewportMetrics | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Measure Viewport & Update CSS Variables (--vh, --u, --pbg)
  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Set --vh: innerHeight / 100
    document.documentElement.style.setProperty('--vh', `${h / 100}px`);

    const m = computeViewportMetrics(w, h);
    setMetrics(m);
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [updateMetrics]);

  // Set initial page background color
  useEffect(() => {
    const prod = PRODUCTS[activeItemIndex] || PRODUCTS[0];
    document.documentElement.style.setProperty('--pbg', prod.backgroundColor);
  }, [activeItemIndex]);

  if (!metrics) return null;

  return (
    <main className="relative w-full h-full overflow-hidden">
      {/* Studio Brand Logo */}
      <Logo onClick={() => {}} />

      {/* Hero Section / Home Stage */}
      <HomeStage
        metrics={metrics}
        onDiscover={() => {}}
        activeItemIndex={activeItemIndex}
        morphProgress={0}
        isMorphing={false}
      />
    </main>
  );
};
