'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Modal: React.FC<ModalProps> = ({ children, open = false, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleOpen = () => {
    setIsOpen(true);
    onOpenChange?.(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, open: handleOpen, close: handleClose }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={handleClose}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

interface ModalHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ className = '', children }) => (
  <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

interface ModalTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const ModalTitle: React.FC<ModalTitleProps> = ({ className = '', children }) => (
  <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h2>
);

interface ModalContentProps {
  className?: string;
  children: React.ReactNode;
}

export const ModalContent: React.FC<ModalContentProps> = ({ className = '', children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

interface ModalFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ className = '', children }) => (
  <div className={`p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end ${className}`}>
    {children}
  </div>
);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a Modal component');
  }
  return context;
}
