'use client';

import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
  decorative = true,
}) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 ${
      orientation === 'horizontal'
        ? 'h-[1px] w-full'
        : 'h-full w-[1px]'
    } ${className}`}
    role={decorative ? 'none' : 'separator'}
    aria-orientation={orientation}
  />
);
