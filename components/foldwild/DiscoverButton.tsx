import React from 'react';

interface DiscoverButtonProps {
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DiscoverButton: React.FC<DiscoverButtonProps> = ({
  onClick,
  className = '',
  style = {},
}) => {
  return (
    <button
      onClick={onClick}
      className={`group select-none flex items-center justify-between rounded-full bg-[#1D1B2E] text-[#FAF6F0] transition-transform duration-500 hover:-translate-y-[3px] shadow-[0_calc(18*var(--u))_calc(40*var(--u))_rgba(29,27,46,0.18)] cursor-pointer ${className}`}
      style={{
        height: 'calc(66 * var(--u))',
        paddingLeft: 'calc(38 * var(--u))',
        paddingRight: 'calc(38 * var(--u))',
        gap: 'calc(24 * var(--u))',
        ...style,
      }}
      aria-label="Discover product"
    >
      <span className="text-[calc(17*var(--u))] font-medium tracking-normal text-[#FAF6F0] whitespace-nowrap">
        Discover
      </span>

      {/* Arrow: 26 x 12u, translates right by 6px on hover */}
      <svg
        viewBox="0 0 26 12"
        className="w-[calc(26*var(--u))] h-[calc(12*var(--u))] fill-none stroke-[#FAF6F0] stroke-[1.5] transition-transform duration-500 group-hover:translate-x-[6px]"
      >
        <path d="M0 6h24M18 1l5 5-5 5" />
      </svg>
    </button>
  );
};
