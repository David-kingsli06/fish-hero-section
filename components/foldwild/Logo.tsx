import React from 'react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ onClick, className = '' }) => {
  return (
    <a
      href="#/"
      onClick={onClick}
      className={`fixed top-[calc(36*var(--u))] left-[calc(42*var(--u))] z-[75] flex items-center gap-[calc(10*var(--u))] select-none cursor-pointer group ${className}`}
      aria-label="Origami Studio Home"
    >
      {/* Geometric paper crane / fold mark: clean solid ink triangle with translucent facet */}
      <div className="relative w-[calc(24*var(--u))] h-[calc(24*var(--u))] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main geometric facet */}
          <polygon points="12,2 2,22 17,17" fill="#1D1B2E" />
          {/* Overlapping folded wing facet with delicate multiply opacity */}
          <polygon
            points="12,2 22,22 17,17"
            fill="#1D1B2E"
            opacity="0.45"
            style={{ mixBlendMode: 'multiply' }}
          />
        </svg>
      </div>

      {/* Stacked brand wordmark: origami \n studio */}
      <div className="flex flex-col text-[calc(22*var(--u))] font-medium leading-[0.88] tracking-tight text-[#1D1B2E]">
        <span>origami</span>
        <span>studio</span>
      </div>
    </a>
  );
};
