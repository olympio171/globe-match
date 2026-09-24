import React, { useState } from 'react';
import { imageAtWidth, imageFor } from '../data/destinations';
import type { Destination } from '../types';

interface CoverProps {
  dest: Destination;
  width: 330 | 500 | 960 | 1280;
  className?: string;
  showCredit?: boolean;
  eager?: boolean;
}

/**
 * Destination photo from Wikimedia Commons, with its attribution. Falls back
 * to a gradient in the destination’s own colours when there is no photo or it
 * fails to load, so a card never shows a broken image.
 */
export const Cover: React.FC<CoverProps> = ({ dest, width, className = '', showCredit, eager }) => {
  const image = imageFor(dest.id);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fallback = `linear-gradient(135deg, oklch(0.62 0.13 ${dest.hue}), oklch(0.45 0.12 ${(dest.hue + 40) % 360}))`;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: fallback }}>
      {image && !failed && (
        <img
          src={imageAtWidth(image, width)}
          srcSet={width < 960 ? `${imageAtWidth(image, width)} 1x, ${imageAtWidth(image, width === 330 ? 500 : 960)} 2x` : undefined}
          alt={dest.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {showCredit && image && !failed && (
        <a
          href={image.source}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 z-10 max-w-[70%] truncate rounded-full bg-black/45 px-2.5 py-1 text-[0.65rem] text-white/85 backdrop-blur-sm hover:bg-black/65"
          title={`Photo : ${image.credit} — Wikimedia Commons`}
        >
          Photo : {image.credit}
        </a>
      )}
    </div>
  );
};
