'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { INTRO_FILM_URL } from '@/lib/foldwild-data';

interface IntroFilmProps {
  onComplete: () => void;
}

const PHRASES = [
  { text: 'We fold', start: 0.4, end: 3.0 },
  { text: 'the wild', start: 3.4, end: 6.2 },
  { text: 'in paper', start: 6.6, end: 9.4 },
];

export const IntroFilm: React.FC<IntroFilmProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const [countdownText, setCountdownText] = useState('00:10');
  const [activePhraseIndex, setActivePhraseIndex] = useState<number | null>(null);
  const hasCompletedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      finishIntro();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Timeout fallback: if video hasn't started after 6s
    const timeoutTimer = setTimeout(() => {
      if (video.currentTime === 0 || video.paused) {
        finishIntro();
      }
    }, 6000);

    const handleTimeUpdate = () => {
      const cur = video.currentTime;
      const dur = video.duration || 10.04;

      // Update progress bar
      if (progressBarRef.current) {
        const progress = Math.min(cur / dur, 1);
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Update countdown: remaining time e.g. 00:08
      const remaining = Math.max(0, Math.ceil(dur - cur));
      const sec = remaining < 10 ? `0${remaining}` : `${remaining}`;
      setCountdownText(`00:${sec}`);

      // Check phrase timings
      let currentIdx: number | null = null;
      for (let i = 0; i < PHRASES.length; i++) {
        if (cur >= PHRASES[i].start && cur < PHRASES[i].end) {
          currentIdx = i;
          break;
        }
      }
      setActivePhraseIndex(currentIdx);
    };

    const handleEnded = () => {
      finishIntro();
    };

    const handleError = () => {
      finishIntro();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    video.play().catch(() => {
      // autoplay might be blocked, finish or wait
    });

    return () => {
      clearTimeout(timeoutTimer);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [finishIntro]);

  // Animate phrase letters on phrase change
  useEffect(() => {
    if (activePhraseIndex === null || !wordsContainerRef.current) return;
    const letters = wordsContainerRef.current.querySelectorAll('.intro-char');
    if (letters.length > 0) {
      gsap.fromTo(
        letters,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.04,
          ease: 'expo.out',
        }
      );
    }
  }, [activePhraseIndex]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[95] bg-[#BEE5D3] overflow-hidden flex flex-col items-center justify-between pointer-events-auto select-none"
    >
      {/* Top progress bar: 3px, scaleX(currentTime/duration) */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent pointer-events-none">
        <div
          ref={progressBarRef}
          className="w-full h-full bg-[#1D1B2E] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Intro video background */}
      <video
        ref={videoRef}
        src={INTRO_FILM_URL}
        muted
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '35% 50%' }}
      />

      {/* Overlay to ensure soft contrast */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      {/* Timed words: 27% from top, centered, #1D1B2E, weight 500, desktop 150u, mobile 64px, tracking -0.02em */}
      <div
        ref={wordsContainerRef}
        className="absolute top-[27%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center whitespace-nowrap"
      >
        {activePhraseIndex !== null && (
          <h1 className="text-[#1D1B2E] font-medium tracking-[-0.02em] text-[64px] lg:text-[calc(150*var(--u))] leading-none">
            {PHRASES[activePhraseIndex].text.split('').map((char, i) => (
              <span
                key={i}
                className="intro-char inline-block"
                style={{ willChange: 'transform, opacity' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        )}
      </div>

      {/* Bottom controls: bottom center 46u from bottom */}
      <div className="absolute bottom-[calc(46*var(--u))] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-[calc(12*var(--u))]">
        {/* Skip button: ink pill, 56u tall */}
        <button
          onClick={finishIntro}
          className="h-[calc(56*var(--u))] min-h-[46px] px-[calc(32*var(--u))] px-6 rounded-full bg-[#1D1B2E] text-[#FAF6F0] flex items-center gap-2 text-[calc(15*var(--u))] text-sm font-medium hover:scale-105 active:scale-95 transition-all shadow-lg"
          aria-label="Skip intro film"
        >
          <span>Skip</span>
          <span className="text-lg">→</span>
        </button>

        {/* Countdown: 00:10, 14u, tabular figures */}
        <span className="text-[#1D1B2E] font-mono text-[calc(14*var(--u))] text-xs font-medium tabular-nums opacity-80">
          {countdownText}
        </span>
      </div>
    </div>
  );
};
