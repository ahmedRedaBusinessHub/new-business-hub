'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  circle?: boolean;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  circle = false,
  width,
  height,
}) => {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${
            circle ? 'rounded-full' : 'rounded-md'
          } ${className}`}
          style={{
            width: width || '100%',
            height: height || '16px',
          }}
        />
      ))}
    </>
  );
};
