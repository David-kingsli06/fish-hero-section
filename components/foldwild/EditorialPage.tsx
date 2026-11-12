'use client';

import React, { useRef, useState } from 'react';
import {
  EDITORIAL_PAGES,
  EditorialPageData,
  PRODUCTS,
} from '@/lib/foldwild-data';
import { ViewportMetrics } from '@/lib/viewport';
import { SceneImage } from './SceneImage';
import { PaperObject } from './PaperObject';

interface EditorialPageProps {
  pageId: 'about' | 'studio' | 'journal';
  metrics: ViewportMetrics;
  onNavigateHash: (hash: string) => void;
  onScroll?: (y: number) => void;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({
  pageId,
  metrics,
  onNavigateHash,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const data: EditorialPageData = EDITORIAL_PAGES[pageId] || EDITORIAL_PAGES.about;
  const { isMobile } = metrics;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const y = e.currentTarget.scrollTop;
    setScrollY(y);
    if (onScroll) onScroll(y);
  };

  const otherPages = (['about', 'studio', 'journal'] as const).filter(
    (id) => id !== pageId
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar select-none"
      style={{ backgroundColor: data.pageColor }}
    >
      <div className="w-full relative">
        {/* SECTION 54: EDITORIAL COVER */}
        <section
          className="relative w-full h-screen overflow-hidden flex items-center"
          style={{ backgroundColor: data.pageColor }}
        >
          {/* Cover Scene Image */}
          <div
            className="absolute"
            style={
              isMobile
                ? {
                    top: '12vh',
                    left: 0,
                    width: '100%',
                    height: '62vw',
                  }
                : {
                    left: 0,
                    top: '23vh',
                    width: 'calc(864 * var(--u))',
                    height: '54vh',
                  }
            }
          >
            <SceneImage
              sheet={data.coverScene.sheet}
              quadrant={data.coverScene.quadrant}
              zoom={1.04}
              className="w-full h-full rounded-r-[24px] shadow-sm"
              style={{
                transform: `translateY(${-scrollY * 0.08}px)`,
              }}
            />
          </div>

          {/* White Card */}
          <div
            className="absolute bg-white rounded-[20px] shadow-md z-10 p-[calc(40*var(--u))] md:p-[calc(60*var(--u))]"
            style={
              isMobile
                ? {
                    top: 'calc(12vh + 62vw - 40px)',
                    left: '16px',
                    right: '16px',
                    width: 'auto',
                  }
                : {
                    left: 'calc(770 * var(--u))',
                    top: '29vh',
                    width: 'calc(462 * var(--u))',
                  }
            }
          >
            <span className="text-[12px] md:text-[calc(13*var(--u))] uppercase tracking-widest text-[#77757f] font-medium block mb-2">
              Foldwild Studio
            </span>
            <h1 className="text-[26px] md:text-[calc(32*var(--u))] font-medium text-[#1D1B2E] tracking-tight mb-4">
              {data.title}
            </h1>
            <p className="text-[14px] md:text-[calc(16*var(--u))] text-[#77757f] leading-relaxed">
              {data.coverDescription}
            </p>
          </div>
        </section>

        {/* SECTION 55: EDITORIAL CONTENT BLOCKS */}
        <section className="relative w-full bg-[#FBFAF8] py-[calc(140*var(--u))] px-6 md:px-[calc(162*var(--u))]">
          <div className="max-w-[1200px] mx-auto space-y-[calc(150*var(--u))]">
            {data.blocks.map((block, idx) => {
              const isMirrored = idx % 2 === 1;

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    isMirrored ? 'md:flex-row-reverse' : 'md:flex-row'
                  } items-center justify-between gap-12 md:gap-16`}
                >
                  {/* Text Column */}
                  <div className="w-full md:w-[calc(420*var(--u))] max-w-[500px]">
                    <h2 className="text-[26px] md:text-[calc(34*var(--u))] font-medium text-[#1D1B2E] mb-6">
                      {block.title}
                    </h2>
                    <p className="text-[15px] md:text-[calc(16*var(--u))] text-[#55535f] leading-[1.8]">
                      {block.text}
                    </p>
                  </div>

                  {/* Image Column */}
                  <div
                    className="w-full md:w-[calc(620*var(--u))] rounded-[20px] overflow-hidden shadow-sm"
                    style={{
                      height: isMobile ? '76vw' : 'calc(470 * var(--u))',
                    }}
                  >
                    <SceneImage
                      sheet={block.sceneSheet}
                      quadrant={block.quadrant}
                      zoom={1.04}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 56: EDITORIAL ASK BAND */}
        <section className="relative w-full pt-[calc(110*var(--u))] pb-[calc(90*var(--u))] px-6 text-center bg-[#FBFAF8]">
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

        {/* SECTION 56: EDITORIAL CARDS */}
        <section className="relative w-full pb-[calc(140*var(--u))] px-6 bg-[#FBFAF8]">
          <div className="max-w-[1200px] mx-auto flex flex-wrap md:flex-nowrap justify-center gap-[calc(38*var(--u))]">
            {/* Morpho Collection Card */}
            <div
              onClick={() => onNavigateHash('#/item/morpho')}
              className="group relative cursor-pointer rounded-[20px] overflow-hidden shadow-sm transition-transform duration-700 hover:-translate-y-[calc(10*var(--u))]"
              style={{
                width: isMobile ? '100%' : 'calc(340 * var(--u))',
                height: 'calc(380 * var(--u))',
                backgroundColor: PRODUCTS[0].cardColor,
              }}
            >
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-[calc(15*var(--u))] py-[calc(7*var(--u))] rounded-full text-[calc(16*var(--u))] font-medium text-[#1D1B2E]">
                Collection
              </div>
              <div className="absolute inset-0 p-6 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                <PaperObject
                  sheet={PRODUCTS[0].sheet}
                  quadrant={PRODUCTS[0].objects[1].quadrant}
                  width={isMobile ? 120 : 160}
                />
              </div>
            </div>

            {/* Other Editorial Pages */}
            {otherPages.map((pageKey) => {
              const other = EDITORIAL_PAGES[pageKey];
              return (
                <div
                  key={pageKey}
                  onClick={() => onNavigateHash(`#/${pageKey}`)}
                  className="group relative cursor-pointer rounded-[20px] overflow-hidden shadow-sm transition-transform duration-700 hover:-translate-y-[calc(10*var(--u))]"
                  style={{
                    width: isMobile ? '100%' : 'calc(340 * var(--u))',
                    height: 'calc(380 * var(--u))',
                    backgroundColor: other.pageColor,
                  }}
                >
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-[calc(15*var(--u))] py-[calc(7*var(--u))] rounded-full text-[calc(16*var(--u))] font-medium text-[#1D1B2E] capitalize">
                    {pageKey}
                  </div>
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <SceneImage
                      sheet={other.coverScene.sheet}
                      quadrant={other.coverScene.quadrant}
                      zoom={1}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
