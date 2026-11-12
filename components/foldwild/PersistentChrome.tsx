import React from 'react';
import { Logo } from './Logo';
import { Burger } from './Burger';
import { FooterLinks } from './FooterLinks';

interface PersistentChromeProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onNavigateHome: () => void;
  onReplayFilm: () => void;
  showFixedFooter: boolean;
  pageBackground: string;
  burgerRef?: React.RefObject<HTMLButtonElement | null>;
  scrollY?: number;
}

export const PersistentChrome: React.FC<PersistentChromeProps> = ({
  isMenuOpen,
  onToggleMenu,
  onNavigateHome,
  onReplayFilm,
  showFixedFooter,
  burgerRef,
  scrollY = 0,
}) => {
  // Section 18: Mobile header backdrop
  // Phones: height 74px, Tablets: 96px, fixed, bg: --pbg
  // Fades in over 0.4s after page scroll exceeds 40px
  const showBackdrop = scrollY > 40;

  return (
    <>
      {/* Mobile header backdrop */}
      <div
        className={`fixed top-0 left-0 w-full pointer-events-none z-[70] transition-opacity duration-400 md:hidden ${
          showBackdrop ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          height: '74px',
          backgroundColor: 'var(--pbg)',
        }}
      />
      <div
        className={`fixed top-0 left-0 w-full pointer-events-none z-[70] transition-opacity duration-400 hidden md:block lg:hidden ${
          showBackdrop ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          height: '96px',
          backgroundColor: 'var(--pbg)',
        }}
      />

      <Logo onClick={onNavigateHome} />
      <Burger
        isOpen={isMenuOpen}
        onClick={onToggleMenu}
        buttonRef={burgerRef}
      />
      {showFixedFooter && <FooterLinks onReplayFilm={onReplayFilm} />}
    </>
  );
};
