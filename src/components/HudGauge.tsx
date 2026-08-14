import React, { useId } from 'react';

interface HudGaugeProps {
  /** Completion from 0 to 100. */
  value: number;
  /** Outer square size in pixels. */
  size?: number;
  strokeWidth?: number;
  /** Rendered in the middle of the ring. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Radial instrument gauge. The arc is drawn with stroke-dashoffset so the
 * sweep animates in CSS rather than JavaScript.
 */
export const HudGauge: React.FC<HudGaugeProps> = ({
  value,
  size = 88,
  strokeWidth = 4,
  children,
  className = '',
}) => {
  // useId keeps the gradient unique when several gauges share a page.
  const gradientId = `hud-gauge-${useId().replace(/:/g, '')}`;

  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        <circle
          className="hud-gauge-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />

        <circle
          className="hud-gauge-arc"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
        {children}
      </div>
    </div>
  );
};
