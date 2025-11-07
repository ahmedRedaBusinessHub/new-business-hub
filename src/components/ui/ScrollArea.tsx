'use client';

import React, { useRef, useEffect } from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className = '',
  height = '400px',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={`overflow-y-auto overflow-x-hidden relative ${className}`}
      style={{ height }}
    >
      <style>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark div::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark div::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
      {children}
    </div>
  );
};
