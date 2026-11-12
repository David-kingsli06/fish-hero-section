'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SCENE_SHEETS } from '@/lib/foldwild-data';

interface SceneImageProps {
  sheet: 'c1' | 'c2';
  quadrant: 0 | 1 | 2 | 3;
  zoom?: number; // 1.04 for page images, 1 for cards
  className?: string;
  style?: React.CSSProperties;
}

export const SceneImage: React.FC<SceneImageProps> = ({
  sheet,
  quadrant,
  zoom = 1.04,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgStyle, setBgStyle] = useState<{
    size: string;
    pos: string;
  }>({ size: 'auto', pos: 'center' });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const bw = containerRef.current.clientWidth;
      const bh = containerRef.current.clientHeight;

      if (bw === 0 || bh === 0) return;

      // Section 12 Scene crop algorithm:
      // qx = q mod 2
      // qy = floor(q / 2)
      // qw = 2048 / 2 * 0.97
      // qh = 1360 / 2 * 0.96
      // s = max(bw / qw, bh / qh) * zoom
      // background-size = 2048s x 1360s
      // x = bw/2 - (qx + 0.5) * 1024 * s
      // y = bh/2 - (qy + 0.5) * 680 * s
      const qx = quadrant % 2;
      const qy = Math.floor(quadrant / 2);
      const qw = (2048 / 2) * 0.97;
      const qh = (1360 / 2) * 0.96;

      const s = Math.max(bw / qw, bh / qh) * zoom;
      const bgW = 2048 * s;
      const bgH = 1360 * s;

      const posX = bw / 2 - (qx + 0.5) * 1024 * s;
      const posY = bh / 2 - (qy + 0.5) * 680 * s;

      setBgStyle({
        size: `${bgW}px ${bgH}px`,
        pos: `${posX}px ${posY}px`,
      });
    };

    updateSize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(updateSize);
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [quadrant, zoom]);

  const imageUrl = SCENE_SHEETS[sheet];

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: bgStyle.size,
        backgroundPosition: bgStyle.pos,
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
    />
  );
};
