'use client';

import React, { ImgHTMLAttributes } from 'react';

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => (
  <div className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}>
    {children}
  </div>
);

interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, ...props }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
);

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center w-full h-full text-sm font-semibold text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </div>
);

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max = 3, className = '' }) => {
  const childrenArray = React.Children.toArray(children);
  const displayChildren = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {displayChildren}
      {remaining > 0 && (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300">
          +{remaining}
        </div>
      )}
    </div>
  );
};
