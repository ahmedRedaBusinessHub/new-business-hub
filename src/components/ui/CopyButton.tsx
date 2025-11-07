'use client';

import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  successMessage?: string;
  successDuration?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  children = 'Copy',
  className = '',
  successMessage = 'Copied!',
  successDuration = 2000,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), successDuration);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isCopied
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${className}`}
    >
      {isCopied ? successMessage : children}
    </button>
  );
};
