'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PRODUCTS } from '@/lib/foldwild-data';

interface HomeTabsProps {
  currentIndex: number;
  onSelectTab: (index: number) => void;
  progress: number; // 0 to 1 for autoplay line
  className?: string;
}

export const HomeTabs: React.FC<HomeTabsProps> = ({
  currentIndex,
  onSelectTab,
  progress,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevIndexRef = useRef(currentIndex);

  // Section 32: Tab indicator animation
  // Vertical bar 2px rgba(29,27,46,.22) at list's left edge
  // Two-phase movement:
  // Moving down: Phase 1: 0.5s quint.in (stretch toward center), Phase 2: 0.5s quint.out
  // Moving up: Phase 1: 0.5s quint.in (move halfway & widen), Phase 2: 0.5s quint.out
  useEffect(() => {
    const prevIdx = prevIndexRef.current;
    const nextIdx = currentIndex;
    prevIndexRef.current = nextIdx;

    const targetEl = tabItemRefs.current[nextIdx];
    const prevEl = tabItemRefs.current[prevIdx];
    const indicator = indicatorRef.current;

    if (!targetEl || !indicator) return;

    const targetTop = targetEl.offsetTop;
    const targetHeight = targetEl.offsetHeight;

    if (prevIdx === nextIdx || !prevEl) {
      gsap.to(indicator, {
        top: targetTop,
        height: targetHeight,
        duration: 0.5,
        ease: 'power4.out',
      });
      return;
    }

    const isMovingDown = nextIdx > prevIdx;
    const prevTop = prevEl.offsetTop;
    const prevHeight = prevEl.offsetHeight;

    const tl = gsap.timeline();

    if (isMovingDown) {
      // Phase 1: stretch toward target
      const stretchedHeight = targetTop + targetHeight - prevTop;
      tl.to(indicator, {
        height: stretchedHeight,
        duration: 0.4,
        ease: 'power4.in',
      }).to(indicator, {
        top: targetTop,
        height: targetHeight,
        duration: 0.5,
        ease: 'power4.out',
      });
    } else {
      // Moving up
      tl.to(indicator, {
        top: targetTop,
        height: prevTop + prevHeight - targetTop,
        duration: 0.4,
        ease: 'power4.in',
      }).to(indicator, {
        height: targetHeight,
        duration: 0.5,
        ease: 'power4.out',
      });
    }
  }, [currentIndex]);

  return (
    <nav
      ref={containerRef}
      className={`fixed left-[calc(46*var(--u))] top-1/2 -translate-y-1/2 z-[65] flex flex-col gap-[calc(18*var(--u))] pl-[calc(22*var(--u))] select-none ${className}`}
      aria-label="Product collections"
    >
      {/* Tab indicator track & fill */}
      <div
        ref={indicatorRef}
        className="absolute left-0 w-[2px] bg-[rgba(29,27,46,0.22)] rounded-full overflow-hidden"
        style={{ top: 0, height: '40px' }}
      >
        {/* Inner ink progress line: scaleY(0 -> 1) over autoplay */}
        <div
          className="w-full bg-[#1D1B2E] origin-top transition-transform duration-75"
          style={{
            height: '100%',
            transform: `scaleY(${progress})`,
          }}
        />
      </div>

      {PRODUCTS.map((prod, idx) => {
        const isActive = idx === currentIndex;
        return (
          <button
            key={prod.id}
            ref={(el) => {
              tabItemRefs.current[idx] = el;
            }}
            onClick={() => onSelectTab(idx)}
            className={`group text-left flex items-baseline gap-[calc(10*var(--u))] transition-opacity duration-300 cursor-pointer ${
              isActive ? 'opacity-100' : 'opacity-60 hover:opacity-85'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Number: 11u, 70% opacity */}
            <span className="text-[calc(11*var(--u))] font-mono opacity-70">
              0{idx + 1}
            </span>
            {/* Name: 19u, weight 500 */}
            <span className="text-[calc(19*var(--u))] font-medium text-[#1D1B2E] tracking-tight">
              {prod.tab}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
