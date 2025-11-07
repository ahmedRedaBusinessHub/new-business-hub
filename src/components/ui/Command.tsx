'use client';

import React, { createContext, useContext, useState } from 'react';

interface CommandContextType {
  search: string;
  setSearch: (search: string) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

interface CommandProps {
  children: React.ReactNode;
  className?: string;
}

export const Command: React.FC<CommandProps> = ({ children, className = '' }) => {
  const [search, setSearch] = useState('');

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div className={`w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden ${className}`}>
        {children}
      </div>
    </CommandContext.Provider>
  );
};

interface CommandInputProps {
  placeholder?: string;
  className?: string;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  placeholder = 'Search...',
  className = '',
}) => {
  const context = useContext(CommandContext);
  if (!context) throw new Error('CommandInput must be used within Command');

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={context.search}
      onChange={(e) => context.setSearch(e.target.value)}
      className={`w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white ${className}`}
    />
  );
};

interface CommandListProps {
  children: React.ReactNode;
  className?: string;
}

export const CommandList: React.FC<CommandListProps> = ({ children, className = '' }) => (
  <div className={`max-h-64 overflow-y-auto p-2 ${className}`}>{children}</div>
);

interface CommandEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

export const CommandEmpty: React.FC<CommandEmptyProps> = ({
  children = 'No results found.',
  className = '',
}) => (
  <div className={`px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </div>
);

interface CommandItemProps {
  children: React.ReactNode;
  value?: string;
  onSelect?: () => void;
  className?: string;
}

export const CommandItem: React.FC<CommandItemProps> = ({
  children,
  value,
  onSelect,
  className = '',
}) => (
  <button
    onClick={onSelect}
    className={`w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
  >
    {children}
  </button>
);
