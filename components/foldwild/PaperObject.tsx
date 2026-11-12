import React from 'react';
import { SPRITE_URLS, SPRITE_CROPS } from '@/lib/foldwild-data';

interface PaperObjectProps {
  sheet: string; // e.g. 's1'
  quadrant: 'q0' | 'q1' | 'q2' | 'q3';
  width: number; // target width in px
  className?: string;
  style?: React.CSSProperties;
}

export const PaperObject: React.FC<PaperObjectProps> = ({
  sheet,
  quadrant,
  width,
  className = '',
  style = {},
}) => {
  const crop = SPRITE_CROPS[sheet]?.[quadrant] || { cropX: 0, cropY: 0, cropW: 100, cropH: 100 };
  const imageUrl = SPRITE_URLS[sheet];

  // Section 10:
  // bs = w / (cropW / 100)
  // height = w * cropH / cropW
  // background-size: bs px bs px
  // background-position: -(cropX / 100) * bs px -(cropY / 100) * bs px
  const bs = width / (crop.cropW / 100);
  const height = width * (crop.cropH / crop.cropW);
  const posX = -(crop.cropX / 100) * bs;
  const posY = -(crop.cropY / 100) * bs;

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${bs}px ${bs}px`,
        backgroundPosition: `${posX}px ${posY}px`,
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
    />
  );
};
