'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { PRODUCTS, ProductItem } from '@/lib/foldwild-data';
import { ViewportMetrics } from '@/lib/viewport';
import { PaperObject } from './PaperObject';
import { PaperShadow } from './PaperShadow';
import { HomeTabs } from './HomeTabs';
import { DiscoverButton } from './DiscoverButton';

interface HomeStageProps {
  metrics: ViewportMetrics;
  onDiscover: (product: ProductItem) => void;
  activeItemIndex?: number;
  morphProgress?: number; // rc: 0 -> 1
  isMorphing?: boolean;
}

export const HomeStage: React.FC<HomeStageProps> = ({
  metrics,
  onDiscover,
  activeItemIndex = 0,
  morphProgress = 0,
  isMorphing = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Direct DOM references for 60fps GPU transforms (no React re-renders)
  const cardElementRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const slideLayersRef = useRef<{ [slideIdx: number]: HTMLDivElement | null }>({});
  const objectNodesRef = useRef<{
    [key: string]: {
      objEl: HTMLDivElement | null;
      shadowEl: HTMLDivElement | null;
      objWidth: number;
      pcX: number;
      pcY: number;
      phX: number;
      phY: number;
      speed: number;
      isBack: boolean;
      mouseRatio: number;
    };
  }>({});

  // Slider State (Section 21)
  const sliderRef = useRef({
    goto: activeItemIndex,
    smooth: activeItemIndex,
    int: activeItemIndex,
    drag: false,
    trans: false,
    rc: morphProgress,
    alpha: 1,
    velocity: 0,
    lastPanY: 0,
    startTime: 0,
    lastWheelTime: 0,
  });

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // UI state for reactive tab and progress
  const [currentSlideInt, setCurrentSlideInt] = useState(activeItemIndex);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const autoplayStartRef = useRef<number>(Date.now());

  const { W, H, fs, coeffWidth, cardX, cardY, cardWidth, cardHeight, dcx, dcy, isMobile } = metrics;

  // Real index wrapper: ((i % 5) + 5) % 5
  const real = (i: number) => ((Math.round(i) % 5) + 5) % 5;

  // Update rc from props
  useEffect(() => {
    sliderRef.current.rc = morphProgress;
  }, [morphProgress]);

  // Section 22: gotoIdx()
  const gotoIdx = useCallback((targetIndex: number) => {
    const s = sliderRef.current;
    if (s.trans) return;

    let curGoto = s.goto;
    const target = targetIndex;

    // Shortest path around 5-slide loop
    let diff = (target - (curGoto % 5)) % 5;
    if (diff > 2.5) diff -= 5;
    if (diff < -2.5) diff += 5;

    const newTarget = curGoto + diff;
    s.int = real(target);
    setCurrentSlideInt(s.int);

    s.trans = true;
    gsap.to(s, {
      goto: newTarget,
      duration: 2.5,
      ease: 'power4.inOut',
      onComplete: () => {
        s.trans = false;
        s.smooth = s.goto;
      },
    });

    autoplayStartRef.current = Date.now();
  }, []);

  // Autoplay handler (Section 33: 5s linear, advance to next)
  useEffect(() => {
    if (isMorphing) return;

    const interval = setInterval(() => {
      const s = sliderRef.current;
      if (s.drag || s.trans || isMorphing) {
        autoplayStartRef.current = Date.now();
        setAutoplayProgress(0);
        return;
      }

      const elapsed = Date.now() - autoplayStartRef.current;
      const progress = Math.min(elapsed / 5000, 1);
      setAutoplayProgress(progress);

      if (elapsed >= 5000) {
        autoplayStartRef.current = Date.now();
        const nextIdx = (s.int + 1) % 5;
        gotoIdx(nextIdx);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gotoIdx, isMorphing]);

  // Render Title Canvas on active slide change
  const renderCanvasTitle = useCallback(
    (slideIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      const canvasW = Math.min(W * 0.9, 800);
      const canvasH = fs * 2.8;

      if (canvas.width !== canvasW * dpr || canvas.height !== canvasH * dpr) {
        canvas.width = canvasW * dpr;
        canvas.height = canvasH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasW, canvasH);

      const curProduct = PRODUCTS[slideIndex];
      if (!curProduct) {
        ctx.restore();
        return;
      }

      ctx.font = `500 ${fs}px 'Figtree', sans-serif`;
      ctx.fillStyle = '#1D1B2E';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lineSpacing = 1.02 * fs;
      const line1Y = canvasH / 2 - lineSpacing / 2;
      const line2Y = canvasH / 2 + lineSpacing / 2;

      ctx.fillText(curProduct.titleLines[0], canvasW / 2, line1Y);
      ctx.fillText(curProduct.titleLines[1], canvasW / 2, line2Y);

      ctx.restore();
    },
    [W, fs]
  );

  // Redraw title canvas whenever slide index or viewport size changes
  useEffect(() => {
    renderCanvasTitle(currentSlideInt);
  }, [currentSlideInt, renderCanvasTitle]);

  // Pre-calculate positions on resize / metrics change
  useEffect(() => {
    const titleTopBoundary = H / 2 - 1.36 * fs - 0.04 * H;

    PRODUCTS.forEach((prod, sIdx) => {
      prod.objects.forEach((obj, oIdx) => {
        const key = `${sIdx}_${oIdx}`;
        const objWidth = (cardWidth * obj.w) / 100;
        const pcX = cardX + (obj.l / 100) * cardWidth;
        const pcY = (H - cardHeight) / 2 + (obj.t / 100) * cardHeight;

        const dxPrime = isMobile ? obj.mobile[0] : 20 + 0.76 * obj.desktop[0];
        const homeX = (dxPrime * W) / 100;
        let homeY = isMobile ? (obj.mobile[1] * H) / 100 : (obj.desktop[1] * H) / 100;

        if (isMobile) {
          if (obj.isBack) {
            homeY = Math.min(homeY, titleTopBoundary - 0.95 * objWidth);
          } else {
            homeY = Math.max(homeY, titleTopBoundary + 1.45 * fs);
          }
        }

        const phX = homeX - pcX;
        const phY = homeY - pcY;
        const mouseRatio = obj.isBack ? 0.008 : 0.02 + (oIdx / 2) * 0.015;

        const existing = objectNodesRef.current[key];
        objectNodesRef.current[key] = {
          objEl: existing?.objEl || null,
          shadowEl: existing?.shadowEl || null,
          objWidth,
          pcX,
          pcY,
          phX,
          phY,
          speed: obj.speed,
          isBack: !!obj.isBack,
          mouseRatio,
        };
      });
    });
  }, [W, H, fs, cardWidth, cardHeight, cardX, isMobile]);

  // High performance RAF tick directly updating styles via transform3d
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const s = sliderRef.current;

      // Section 21 Smooth interpolation: k = 0.1 dragging, 0.05 otherwise
      if (!s.trans) {
        const k = s.drag ? 0.1 : 0.05;
        const diff = s.goto - s.smooth;
        if (Math.abs(diff) < 1e-5) {
          s.smooth = s.goto;
        } else {
          s.smooth += diff * k;
        }
      }

      // Check integer slide change
      const newInt = real(Math.round(s.smooth));
      if (newInt !== s.int) {
        s.int = newInt;
        setCurrentSlideInt(newInt);
        const currentProd = PRODUCTS[newInt];
        if (currentProd) {
          document.documentElement.style.setProperty('--pbg', currentProd.backgroundColor);
          if (containerRef.current) {
            containerRef.current.style.backgroundColor = currentProd.backgroundColor;
          }
          if (cardElementRef.current) {
            cardElementRef.current.style.backgroundColor = currentProd.cardColor;
          }
        }
      }

      // Section 27: Mouse smoothing
      const r = 1 - s.rc;
      const mouse = mouseRef.current;
      // Responsive mouse interpolation lerp(0.08, 0.15)
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Update Center Card Transform (Section 40)
      if (cardElementRef.current) {
        const scaleX = (W + (cardWidth - W) * s.rc) / cardWidth;
        const scaleY = (H + (cardHeight - H) * s.rc) / cardHeight;
        cardElementRef.current.style.transform = `scale3d(${scaleX}, ${scaleY}, 1)`;
      }

      // Update Title Position & Opacity (Section 30)
      if (titleWrapperRef.current) {
        const titleX = isMobile ? W * 0.5 : 0.56 * W + s.rc * dcx;
        const titleY = H / 2 - 1.36 * fs - (isMobile ? 0.04 * H : 0) + s.rc * dcy;
        titleWrapperRef.current.style.transform = `translate3d(${titleX}px, ${titleY}px, 0) translate(-50%, -50%)`;
        titleWrapperRef.current.style.opacity = `${r}`;
      }

      // Update 5 Slides and their Paper Objects
      PRODUCTS.forEach((_, slideIdx) => {
        let n = slideIdx - (s.smooth % 5);
        if (n > 2.5) n -= 5;
        if (n < -2.5) n += 5;

        const slideLayer = slideLayersRef.current[slideIdx];
        const isVisible = Math.abs(n) < 1.3;

        if (slideLayer) {
          if (!isVisible) {
            slideLayer.style.display = 'none';
          } else {
            slideLayer.style.display = 'block';
            slideLayer.style.opacity = `${Math.max(0, 1 - Math.abs(n))}`;

            const dy = n * H * coeffWidth;

            // Update each paper object in this slide directly
            for (let oIdx = 0; oIdx < 3; oIdx++) {
              const node = objectNodesRef.current[`${slideIdx}_${oIdx}`];
              if (!node || !node.objEl || !node.shadowEl) continue;

              const mouseOffsetX = mouse.x * node.mouseRatio * r;
              const mouseOffsetY = mouse.y * node.mouseRatio * r;

              const finalX = node.pcX + node.phX * r + mouseOffsetX;
              const finalY = node.pcY + dy * node.speed + node.phY * r + mouseOffsetY;

              node.objEl.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;

              const shadowX = finalX + 0.19 * node.objWidth;
              const shadowY = finalY + 1.02 * (node.objWidth * 0.8) + 0.05 * H * r;
              const shadowAlpha = (node.isBack ? 0.33 : 0.55) * (0.55 + 0.45 * r);

              node.shadowEl.style.transform = `translate3d(${shadowX}px, ${shadowY}px, 0)`;
              node.shadowEl.style.opacity = `${shadowAlpha}`;
            }
          }
        }
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [W, H, fs, coeffWidth, cardWidth, cardHeight, dcx, dcy, isMobile]);

  // Window-level mouse tracking for instant, fluid parallax
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Section 27: mouse = -(clientX - W/2, clientY - H/2)
      mouseRef.current.targetX = -(e.clientX - window.innerWidth / 2);
      mouseRef.current.targetY = -(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Section 35: Pointer dragging on the hero stage
  const handlePointerDown = (e: React.PointerEvent) => {
    const s = sliderRef.current;
    if (s.trans || isMorphing) return;

    // Capture pointer to ensure drag continuity even if cursor leaves window fast
    e.currentTarget.setPointerCapture(e.pointerId);

    s.drag = true;
    s.startTime = Date.now();
    s.lastPanY = e.clientY;
    s.velocity = 0;
    document.documentElement.classList.add('is-grabbing');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const s = sliderRef.current;
    if (!s.drag) return;

    const deltaY = e.clientY - s.lastPanY;
    s.lastPanY = e.clientY;

    // Pan projection
    const panStep = -deltaY / (H * coeffWidth);
    s.goto += panStep;

    // Instantaneous velocity calculation
    s.velocity = 0.6 * s.velocity + 0.4 * deltaY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const s = sliderRef.current;
    if (!s.drag) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    s.drag = false;
    document.documentElement.classList.remove('is-grabbing');

    // Section 35 On release: r = goto - velocity * 0.2
    const target = Math.round(s.goto - (s.velocity / (H * coeffWidth)) * 0.2);
    s.goto = target;
    autoplayStartRef.current = Date.now();
  };

  // Section 36: Wheel input
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isMorphing) return;
      const s = sliderRef.current;
      if (s.trans) return;

      const delta = (e.deltaY || e.deltaX) * 0.5;
      s.goto += delta / (3 * W);

      clearTimeout(sliderRef.current.lastWheelTime);
      sliderRef.current.lastWheelTime = window.setTimeout(() => {
        s.goto = Math.round(s.goto);
        autoplayStartRef.current = Date.now();
      }, 50);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [W, isMorphing]);

  // Section 37: Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMorphing) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        gotoIdx(sliderRef.current.int + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        gotoIdx(sliderRef.current.int - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gotoIdx, isMorphing]);

  const currentProd = PRODUCTS[currentSlideInt] || PRODUCTS[0];
  const r = 1 - morphProgress;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed inset-0 w-full h-full overflow-hidden select-none touch-none cursor-grab"
      style={{
        backgroundColor: currentProd.backgroundColor,
        transition: isMorphing ? 'none' : 'background-color 0.8s ease',
      }}
    >
      {/* Center Transforming Card (Section 40) */}
      <div
        ref={cardElementRef}
        className="absolute pointer-events-none rounded-[20px] will-change-transform"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          left: `${cardX}px`,
          top: `${cardY + (H - cardHeight) / 2}px`,
          backgroundColor: currentProd.cardColor,
          transformOrigin: 'center center',
          boxShadow: morphProgress > 0.05 ? '0 24px 60px rgba(29,27,46,0.12)' : 'none',
        }}
      />

      {/* Render 5 Slides */}
      {PRODUCTS.map((prod, slideIdx) => (
        <div
          key={prod.id}
          ref={(el) => {
            slideLayersRef.current[slideIdx] = el;
          }}
          className="absolute inset-0 pointer-events-none will-change-transform"
        >
          {prod.objects.map((obj, objIdx) => {
            const key = `${slideIdx}_${objIdx}`;
            const objWidth = (cardWidth * obj.w) / 100;

            return (
              <React.Fragment key={objIdx}>
                {/* Paper Shadow */}
                <div
                  ref={(el) => {
                    if (objectNodesRef.current[key]) {
                      objectNodesRef.current[key].shadowEl = el;
                    }
                  }}
                  className="absolute top-0 left-0 will-change-transform"
                  style={{
                    zIndex: obj.isBack ? 10 : 25,
                  }}
                >
                  <PaperShadow
                    objectWidth={objWidth}
                    opacity={obj.isBack ? 0.33 : 0.55}
                  />
                </div>

                {/* Paper Object */}
                <div
                  ref={(el) => {
                    if (objectNodesRef.current[key]) {
                      objectNodesRef.current[key].objEl = el;
                    }
                  }}
                  className="absolute top-0 left-0 will-change-transform"
                  style={{
                    zIndex: obj.isBack ? 15 : 30,
                  }}
                >
                  <PaperObject
                    sheet={prod.sheet}
                    quadrant={obj.quadrant}
                    width={objWidth}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ))}

      {/* Title Canvas Wrapper (Section 28 & 30) */}
      <div
        ref={titleWrapperRef}
        className="absolute top-0 left-0 pointer-events-none will-change-transform"
        style={{ zIndex: 20 }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Home Controls (Tabs & Discover Button) */}
      <div
        className="pointer-events-auto"
        style={{
          opacity: Math.pow(r, 3),
          transition: 'opacity 0.3s ease',
        }}
      >
        {!isMobile && (
          <HomeTabs
            currentIndex={currentSlideInt}
            onSelectTab={gotoIdx}
            progress={autoplayProgress}
          />
        )}

        {/* Discover Button */}
        <div
          className="fixed z-[65]"
          style={
            isMobile
              ? {
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: 'calc(18 * var(--vh))',
                }
              : {
                  left: 'calc(56vw - calc(96 * var(--u)))',
                  top: 'calc(71vh - calc(33 * var(--u)))',
                }
          }
        >
          <DiscoverButton onClick={() => onDiscover(currentProd)} />
        </div>
      </div>
    </div>
  );
};
