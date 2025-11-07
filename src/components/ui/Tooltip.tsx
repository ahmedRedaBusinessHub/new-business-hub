'use client';

import React, { createContext, useContext, useState } from 'react';

interface TooltipContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

interface TooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContext.Provider value={{ isVisible, setIsVisible }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, className = '' }) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error('TooltipTrigger must be used within Tooltip');

  return (
    <div
      onMouseEnter={() => context.setIsVisible(true)}
      onMouseLeave={() => context.setIsVisible(false)}
      onFocus={() => context.setIsVisible(true)}
      onBlur={() => context.setIsVisible(false)}
      className={`cursor-help inline-block ${className}`}
    >
      {children}
    </div>
  );
};

interface TooltipContentProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const TooltipContent: React.FC<TooltipContentProps> = ({
  children,
  side = 'top',
  className = '',
}) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error('TooltipContent must be used within Tooltip');

  if (!context.isVisible) return null;

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[side]} ${className}`}
    >
      {children}
    </div>
  );
};
