'use client';

import React, { createContext, useContext, useState } from 'react';

interface CollapsibleContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

interface CollapsibleProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  open = false,
  onOpenChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleSetIsOpen = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleContext.Provider value={{ isOpen, setIsOpen: handleSetIsOpen }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
};

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  className = '',
}) => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error('CollapsibleTrigger must be used within Collapsible');

  return (
    <button
      onClick={() => context.setIsOpen(!context.isOpen)}
      className={`flex items-center justify-between w-full font-semibold transition-colors hover:text-gray-700 dark:hover:text-gray-300 ${className}`}
    >
      <span>{children}</span>
      <span
        className={`transition-transform duration-300 ${
          context.isOpen ? 'rotate-180' : ''
        }`}
      >
        ▼
      </span>
    </button>
  );
};

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  children,
  className = '',
}) => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error('CollapsibleContent must be used within Collapsible');

  if (!context.isOpen) return null;

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
