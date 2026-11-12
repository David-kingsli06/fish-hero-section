import React from 'react';

interface BurgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Burger: React.FC<BurgerProps> = ({
  isOpen,
  onClick,
  className = '',
  buttonRef,
}) => {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={`fixed top-[calc(36*var(--u))] right-[calc(42*var(--u))] z-[80] w-[calc(58*var(--u))] h-[calc(58*var(--u))] rounded-full flex items-center justify-center relative select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* Background circle that scales 0 -> 1 behind bars when open */}
      <div
        className="absolute inset-0 rounded-full bg-[#1D1B2E] transition-transform"
        style={{
          transform: isOpen ? 'scale(1)' : 'scale(0)',
          transitionDuration: '0.5s',
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)',
        }}
      />

      {/* Three bars container */}
      <div className="relative w-[44%] h-[16px] flex flex-col justify-between items-center pointer-events-none">
        {/* Top bar: rotates +45deg and scales to 0.6 width */}
        <span
          className="h-[2px] rounded-full transition-all block"
          style={{
            backgroundColor: isOpen ? '#FAF6F0' : '#1D1B2E',
            width: isOpen ? '60%' : '100%',
            transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'translateY(0) rotate(0deg)',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)',
          }}
        />

        {/* Middle bar: fades out */}
        <span
          className="w-full h-[2px] rounded-full transition-all block"
          style={{
            backgroundColor: isOpen ? '#FAF6F0' : '#1D1B2E',
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)',
          }}
        />

        {/* Bottom bar: rotates -45deg and scales to 0.6 width */}
        <span
          className="h-[2px] rounded-full transition-all block"
          style={{
            backgroundColor: isOpen ? '#FAF6F0' : '#1D1B2E',
            width: isOpen ? '60%' : '100%',
            transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'translateY(0) rotate(0deg)',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)',
          }}
        />
      </div>
    </button>
  );
};
