'use client';

import React from 'react';

interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number;
  className?: string;
}

export const AspectRatio: React.FC<AspectRatioProps> = ({
  children,
  ratio = 16 / 9,
  className = '',
}) => (
  <div
    className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-lg ${className}`}
    style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
  >
    <div className="absolute inset-0">{children}</div>
  </div>
);
