'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PRODUCTS, ProductItem } from '@/lib/foldwild-data';
import { ViewportMetrics } from '@/lib/viewport';
import { PaperObject } from './PaperObject';
import { PaperShadow } from './PaperShadow';

interface ProductPageProps {
  product: ProductItem;
  metrics: ViewportMetrics;
  onSelectProduct: (product: ProductItem) => void;
  onScroll?: (y: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  metrics,
  onSelectProduct,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { W, H, cardWidth, cardHeight, isMobile } = metrics;
  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id);

  // Smooth scroll monitoring
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const y = e.currentTarget.scrollTop;
    setScrollY(y);
    if (onScroll) onScroll(y);
  };

  // Video autoplay & visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlaying = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('playing', handlePlaying);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('playing', handlePlaying);
    };
  }, [product.loopVideo]);

  // Section 47: Product Page Hero Card placement
  const heroCardLeft = (W - cardWidth) / 2;
  const heroCardTop = 0;

  // Parallax calculations (Section 46)
  // Float object parallax: 50vh -> -32vh
  const floatProgress = Math.min(Math.max((scrollY - H * 0.8) / (H * 1.5), 0), 1);
  const floatY = 50 - floatProgress * 82; // 50vh -> -32vh
  const floatRot = -7 + floatProgress * 14; // -7deg -> +7deg

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar select-none"
      style={{
        backgroundColor: product.backgroundColor,
      }}
    >
      <div id="pageIn" className="w-full relative">
        {/* SECTION 47: HERO SECTION */}
        <section
          className="relative w-full pb-[calc(110*var(--u))] overflow-hidden"
          style={{ minHeight: isMobile ? 'auto' : '100vh' }}
        >
          {/* Destination Card */}
          <div
            className="absolute rounded-[20px]"
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              left: `${heroCardLeft}px`,
              top: `${heroCardTop + (H - cardHeight) / 2}px`,
              backgroundColor: product.cardColor,
              boxShadow: '0 24px 60px rgba(29,27,46,0.12)',
            }}
          />

          {/* Destination Paper Objects */}
          <div className="absolute inset-0 pointer-events-none">
            {product.objects.map((obj, idx) => {
              const objWidth = (cardWidth * obj.w) / 100;
              const objX = heroCardLeft + (obj.l / 100) * cardWidth;
              const baseObjY = (H - cardHeight) / 2 + (obj.t / 100) * cardHeight;

              // Speed Parallax (Section 46): -(center - viewportCenter) * (sp - 1)
              const parallaxY = -scrollY * (obj.speed - 1);
              const finalObjY = baseObjY + parallaxY;

              const shadowX = objX + 0.19 * objWidth;
              const shadowY = finalObjY + 1.02 * (objWidth * 0.8);

              return (
                <React.Fragment key={idx}>
                  <div
                    className="absolute"
                    style={{
                      left: `${shadowX}px`,
                      top: `${shadowY}px`,
                      zIndex: obj.isBack ? 10 : 25,
                    }}
                  >
                    <PaperShadow
                      objectWidth={objWidth}
                      opacity={obj.isBack ? 0.33 : 0.55}
                    />
                  </div>
                  <div
                    className="absolute"
                    style={{
                      left: `${objX}px`,
                      top: `${finalObjY}px`,
                      zIndex: obj.isBack ? 15 : 30,
                    }}
                  >
                    <PaperObject
                      sheet={product.sheet}
                      quadrant={obj.quadrant}
                      width={objWidth}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* SECTION 48: PRODUCT HERO TEXT */}
          <div
            className="relative mx-auto text-center flex flex-col items-center px-6"
            style={{
              maxWidth: isMobile ? '100%' : 'calc(600 * var(--u))',
              paddingTop: isMobile
                ? 'calc(104vw + 26px)'
                : 'calc(64vh + calc(44 * var(--u)))',
            }}
          >
            <span className="text-[calc(13*var(--u))] text-xs font-medium opacity-70 tracking-wide uppercase text-[#1D1B2E] mb-[calc(10*var(--u))]">
              Collection
            </span>
            <h1 className="text-[28px] md:text-[calc(34*var(--u))] font-medium tracking-tight text-[#1D1B2E] mb-[calc(24*var(--u))]">
              {product.titleLines.join(' ')}
            </h1>
            <p className="text-[15px] md:text-[calc(16*var(--u))] text-[#1D1B2E]/80 leading-[1.75] font-normal">
              {product.description}
            </p>
          </div>
        </section>

        {/* SECTION 49: PRODUCT LOOP BAND */}
        <section
          className="relative mx-[6vw] rounded-[24px] overflow-hidden my-[calc(60*var(--u))]"
          style={{
            height: isMobile ? '62vw' : '84vh',
            backgroundColor: product.cardColor,
          }}
        >
          {/* Fallback paper objects */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-800 ${
              videoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div
              className="relative"
              style={{
                width: isMobile ? '105%' : '62%',
                height: '70%',
              }}
            >
              {product.objects.map((obj, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${obj.l}%`,
                    top: `${obj.t}%`,
                  }}
                >
                  <PaperObject
                    sheet={product.sheet}
                    quadrant={obj.quadrant}
                    width={cardWidth * 0.35}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Seamless Product Loop Video */}
          <video
            ref={videoRef}
            src={product.loopVideo}
            muted
            loop
            playsInline
            autoPlay
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </section>

        {/* SECTION 50: PRODUCT INFO SECTION */}
        <section
          className="relative w-full py-[calc(120*var(--u))] pb-[calc(150*var(--u))] px-6 flex flex-col items-center"
          style={{ backgroundColor: product.backgroundColor }}
        >
          {/* Floating object with parallax (50vh -> -32vh, -7deg -> +7deg) */}
          <div
            className="absolute pointer-events-none"
            style={
              isMobile
                ? {
                    top: '40px',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${floatProgress * 4}vh)`,
                  }
                : {
                    left: 'calc(150 * var(--u))',
                    top: '20%',
                    transform: `translateY(${floatY}vh) rotate(${floatRot}deg)`,
                  }
            }
          >
            <PaperObject
              sheet={product.sheet}
              quadrant={product.floatQuadrant}
              width={isMobile ? W * 0.28 : W * 0.14}
            />
          </div>

          <div className="max-w-[calc(600*var(--u))] w-full text-center relative z-10">
            <h2 className="text-[28px] md:text-[calc(34*var(--u))] font-medium text-[#1D1B2E] mb-[calc(36*var(--u))]">
              {product.infoTitle}
            </h2>

            <ul className="space-y-[calc(16*var(--u))] text-[15px] md:text-[calc(17*var(--u))] leading-[1.85] text-[#1D1B2E]/90">
              {product.list.map((item, i) => (
                <li key={i} className="transition-all">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 51: ANY QUESTIONS SECTION */}
        <section className="relative w-full pt-[calc(110*var(--u))] pb-[calc(90*var(--u))] px-6 text-center bg-transparent">
          <h2 className="text-[28px] md:text-[calc(34*var(--u))] font-medium text-[#1D1B2E] mb-[calc(20*var(--u))]">
            Any questions?
          </h2>
          <p className="text-[15px] md:text-[calc(17*var(--u))] text-[#1D1B2E]/80 mb-[calc(36*var(--u))] max-w-[calc(500*var(--u))] mx-auto leading-relaxed">
            Write to us about commissions, editions or workshops. We will be
            happy to answer.
          </p>
          <a
            href="mailto:hello@foldwild.studio"
            className="inline-flex items-center justify-center rounded-full bg-[#1D1B2E] text-[#FAF6F0] px-[calc(36*var(--u))] h-[calc(60*var(--u))] text-[calc(15*var(--u))] font-medium hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Contact us →
          </a>
        </section>

        {/* SECTION 52: RELATED PRODUCT CARDS */}
        <section className="relative w-full pt-[calc(60*var(--u))] pb-[calc(170*var(--u))] px-6">
          {/* Darker band covering bottom 62% */}
          <div
            className="absolute bottom-0 left-0 w-full h-[62%] bg-[rgba(29,27,46,0.07)] pointer-events-none"
          />

          <div className="relative z-10 max-w-[1300px] mx-auto">
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-[calc(38*var(--u))]">
              {otherProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => onSelectProduct(relProduct)}
                  className="group relative cursor-pointer rounded-[20px] overflow-hidden transition-transform duration-700 hover:-translate-y-[calc(10*var(--u))] shadow-sm"
                  style={{
                    width: isMobile ? 'calc(50vw - 23px)' : 'calc(296 * var(--u))',
                    height: isMobile ? 'calc((50vw - 23px) * 1.42)' : 'calc(420 * var(--u))',
                    backgroundColor: relProduct.cardColor,
                  }}
                >
                  {/* Related card paper objects */}
                  <div className="absolute inset-0 p-4 transition-transform duration-700 ease-out group-hover:scale-105">
                    {relProduct.objects.map((relObj, rIdx) => (
                      <div
                        key={rIdx}
                        className="absolute"
                        style={{
                          left: `${relObj.l * 0.8 + 10}%`,
                          top: `${relObj.t * 0.8 + 10}%`,
                        }}
                      >
                        <PaperObject
                          sheet={relProduct.sheet}
                          quadrant={relObj.quadrant}
                          width={isMobile ? 70 : 100}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Arrow circle: 46u, 20u from bottom, 20u from right */}
                  <div
                    className="absolute bottom-[calc(20*var(--u))] right-[calc(20*var(--u))] w-[calc(46*var(--u))] h-[calc(46*var(--u))] rounded-full bg-[#1D1B2E] text-[#FAF6F0] flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                  >
                    <span className="text-sm">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
