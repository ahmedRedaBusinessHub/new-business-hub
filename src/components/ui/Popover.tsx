'use client';

import React, { createContext, useContext, useState } from 'react';

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({ children, open = false, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleSetIsOpen = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen: handleSetIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

interface PopoverTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, className = '' }) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  return (
    <button
      onClick={() => context.setIsOpen(!context.isOpen)}
      className={className}
    >
      {children}
    </button>
  );
};

interface PopoverContentProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  side = 'bottom',
  className = '',
}) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');

  if (!context.isOpen) return null;

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.setIsOpen(false)}
      />
      <div
        className={`absolute z-50 w-64 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${positionClasses[side]} ${className}`}
      >
        {children}
      </div>
    </>
  );
};
