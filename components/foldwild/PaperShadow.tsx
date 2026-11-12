import React from 'react';

interface PaperShadowProps {
  objectWidth: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PaperShadow: React.FC<PaperShadowProps> = ({
  objectWidth,
  opacity = 0.55,
  className = '',
  style = {},
}) => {
  // Section 11:
  // width = 0.62w
  // height = 0.11w
  // border-radius: 50%
  // background: rgba(29,27,46,.22)
  // filter: blur(14px)
  const width = 0.62 * objectWidth;
  const height = 0.11 * objectWidth;

  return (
    <div
      className={`pointer-events-none rounded-full ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'rgba(29, 27, 46, 0.22)',
        filter: 'blur(14px)',
        opacity,
        transform: 'translateZ(0)',
        ...style,
      }}
    />
  );
};
