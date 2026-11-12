import React from 'react';

interface FooterLinksProps {
  onReplayFilm: () => void;
  className?: string;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({
  onReplayFilm,
  className = '',
}) => {
  return (
    <footer
      className={`fixed bottom-[calc(36*var(--u))] left-[calc(46*var(--u))] z-[75] flex items-center gap-[calc(52*var(--u))] text-[calc(13*var(--u))] font-medium text-[#1D1B2E] select-none pointer-events-auto ${className}`}
    >
      {/* EN with 1.5px underline */}
      <span className="border-b-[1.5px] border-[#1D1B2E] cursor-default pb-[1px]">
        EN
      </span>

      {/* FR with 55% opacity */}
      <span className="opacity-55 cursor-pointer hover:opacity-80 transition-opacity">
        FR
      </span>

      {/* Legals -> #/about */}
      <a
        href="#/about"
        className="opacity-80 hover:opacity-100 transition-opacity"
      >
        Legals
      </a>

      {/* Replay film */}
      <button
        onClick={onReplayFilm}
        className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
      >
        Replay film
      </button>
    </footer>
  );
};
