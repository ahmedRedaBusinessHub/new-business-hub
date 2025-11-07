'use client';

import React, { useEffect, useState } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  loop?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 50,
  direction = 'left',
  loop = true,
  pauseOnHover = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`overflow-hidden bg-gray-100 dark:bg-gray-900 ${className}`}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .marquee-content {
          animation: ${direction === 'left' ? 'scroll-left' : 'scroll-right'} ${
        speed
      }s linear infinite;
          animation-play-state: ${isHovered && pauseOnHover ? 'paused' : 'running'};
        }
      `}</style>
      <div className="marquee-content flex whitespace-nowrap">
        {loop && <div className="flex whitespace-nowrap">{children}</div>}
        {children}
      </div>
    </div>
  );
};
