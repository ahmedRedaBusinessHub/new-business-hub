'use client';

import React, { createContext, useContext, useState } from 'react';

interface HoverCardContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const HoverCardContext = createContext<HoverCardContextType | undefined>(undefined);

interface HoverCardProps {
  children: React.ReactNode;
}

export const HoverCard: React.FC<HoverCardProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <HoverCardContext.Provider value={{ isVisible, setIsVisible }}>
      <div className="relative inline-block">{children}</div>
    </HoverCardContext.Provider>
  );
};

interface HoverCardTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const HoverCardTrigger: React.FC<HoverCardTriggerProps> = ({ children, className = '' }) => {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('HoverCardTrigger must be used within HoverCard');

  return (
    <div
      onMouseEnter={() => context.setIsVisible(true)}
      onMouseLeave={() => context.setIsVisible(false)}
      className={className}
    >
      {children}
    </div>
  );
};

interface HoverCardContentProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const HoverCardContent: React.FC<HoverCardContentProps> = ({
  children,
  side = 'top',
  className = '',
}) => {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('HoverCardContent must be used within HoverCard');

  if (!context.isVisible) return null;

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={`absolute z-50 w-64 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-none ${positionClasses[side]} ${className}`}
      onMouseEnter={() => context.setIsVisible(true)}
      onMouseLeave={() => context.setIsVisible(false)}
    >
      {children}
    </div>
  );
};
