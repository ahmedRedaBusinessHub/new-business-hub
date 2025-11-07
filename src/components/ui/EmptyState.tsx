'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No data available',
  description = 'There is nothing to display at the moment.',
  action,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
    {icon && <div className="mb-4 text-4xl">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
    {action && <div>{action}</div>}
  </div>
);
