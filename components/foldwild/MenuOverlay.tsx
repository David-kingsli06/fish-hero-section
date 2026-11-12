'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PRODUCTS, ProductItem } from '@/lib/foldwild-data';
import { ViewportMetrics } from '@/lib/viewport';
import { PaperObject } from './PaperObject';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHash: (hash: string) => void;
  metrics: ViewportMetrics;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
  onNavigateHash,
  metrics,
}) => {
  const [hoveredProductIndex, setHoveredProductIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  const { isMobile, isTablet, isShortLandscape } = metrics;

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Section 60: Circle clip-path reveal animation from burger button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isOpen) {
      setIsRendered(true);

      // Get burger center relative position
      const originX = window.innerWidth - 60;
      const originY = 60;

      // Animate clip-path circle(0% at originX originY) -> circle(150% at originX originY)
      gsap.fromTo(
        container,
        {
          clipPath: `circle(0px at ${originX}px ${originY}px)`,
        },
        {
          clipPath: `circle(200% at ${originX}px ${originY}px)`,
          duration: 1.0,
          ease: 'expo.inOut',
        }
      );

      // Content stagger
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll('.menu-anim-item');
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.05,
            delay: 0.45,
            ease: 'expo.out',
          }
        );
      }
    } else if (isRendered) {
      const originX = window.innerWidth - 60;
      const originY = 60;

      gsap.to(container, {
        clipPath: `circle(0px at ${originX}px ${originY}px)`,
        duration: 0.8,
        ease: 'expo.inOut',
        onComplete: () => {
          setIsRendered(false);
        },
      });
    }
  }, [isOpen, isRendered]);

  if (!isRendered && !isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70] bg-[#FAF6F0] w-full h-full overflow-hidden select-none"
      style={{
        clipPath: 'circle(0px at 100% 0px)',
      }}
    >
      <div ref={contentRef} className="relative w-full h-full">
        {/* SECTION 61: MENU PREVIEW (DESKTOP) */}
        {!isMobile && (
          <div
            className="absolute rounded-[20px] overflow-hidden shadow-lg transition-transform duration-500 menu-anim-item"
            style={{
              left: isShortLandscape ? '9vw' : 'calc(208 * var(--u))',
              top: '26vh',
              width: isShortLandscape ? '25vw' : 'calc(338 * var(--u))',
              height: '48vh',
              backgroundColor: PRODUCTS[hoveredProductIndex].cardColor,
            }}
          >
            {PRODUCTS.map((prod, idx) => (
              <div
                key={prod.id}
                className="absolute inset-0 p-8 flex items-center justify-center transition-opacity duration-600"
                style={{
                  opacity: idx === hoveredProductIndex ? 1 : 0,
                }}
              >
                <div className="relative w-full h-full">
                  {prod.objects.map((obj, oIdx) => (
                    <div
                      key={oIdx}
                      className="absolute"
                      style={{
                        left: `${obj.l}%`,
                        top: `${obj.t}%`,
                      }}
                    >
                      <PaperObject
                        sheet={prod.sheet}
                        quadrant={obj.quadrant}
                        width={isShortLandscape ? 70 : 100}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 62: MENU LINKS */}
        <nav
          className="absolute flex flex-col menu-anim-item"
          style={
            isMobile
              ? {
                  left: '24px',
                  top: '110px',
                  gap: '24px',
                }
              : {
                  left: isShortLandscape ? '42vw' : 'calc(690 * var(--u))',
                  top: '30vh',
                  gap: '4.6vh',
                }
          }
          aria-label="Main menu links"
        >
          {[
            { num: '01.', label: 'Collection', hash: '#/' },
            { num: '02.', label: 'About', hash: '#/about' },
            { num: '03.', label: 'Studio', hash: '#/studio' },
            { num: '04.', label: 'Journal', hash: '#/journal' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onClose();
                onNavigateHash(item.hash);
              }}
              className="group flex items-baseline gap-3 text-left transition-transform duration-300 hover:translate-x-[calc(10*var(--u))] cursor-pointer"
            >
              <span className="text-[12px] md:text-[calc(12*var(--u))] font-mono text-[#1D1B2E]/60">
                {item.num}
              </span>
              <span className="text-[34px] md:text-[calc(38*var(--u))] font-medium text-[#1D1B2E] tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* SECTION 63: MENU PRODUCT LIST */}
        <div
          className="absolute menu-anim-item"
          style={
            isMobile
              ? {
                  left: '24px',
                  right: '24px',
                  bottom: '40px',
                }
              : {
                  left: isShortLandscape ? '70vw' : 'calc(1010 * var(--u))',
                  top: '23vh',
                }
          }
        >
          {isMobile ? (
            /* 5-column grid on mobile */
            <div className="grid grid-cols-5 gap-2">
              {PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => {
                    onClose();
                    onNavigateHash(`#/item/${prod.id}`);
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-[12px] flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: prod.cardColor }}
                  >
                    <PaperObject
                      sheet={prod.sheet}
                      quadrant={prod.objects[1].quadrant}
                      width={38}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#1D1B2E] truncate w-full text-center">
                    {prod.tab}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* Desktop list of 5 rows */
            <div className="flex flex-col gap-4">
              {PRODUCTS.map((prod, idx) => {
                const isHovered = hoveredProductIndex === idx;

                return (
                  <button
                    key={prod.id}
                    onMouseEnter={() => setHoveredProductIndex(idx)}
                    onClick={() => {
                      onClose();
                      onNavigateHash(`#/item/${prod.id}`);
                    }}
                    className={`flex items-center gap-4 text-left transition-opacity duration-300 cursor-pointer ${
                      isHovered ? 'opacity-100 font-medium' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Thumbnail: 62u x 62u */}
                    <div
                      className="rounded-[14px] flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0"
                      style={{
                        width: isShortLandscape ? '44px' : 'calc(62 * var(--u))',
                        height: isShortLandscape ? '44px' : 'calc(62 * var(--u))',
                        backgroundColor: prod.cardColor,
                      }}
                    >
                      <PaperObject
                        sheet={prod.sheet}
                        quadrant={prod.objects[1].quadrant}
                        width={isShortLandscape ? 36 : 48}
                      />
                    </div>

                    <span className="text-[calc(17*var(--u))] text-[#1D1B2E] tracking-tight">
                      {prod.tab}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
