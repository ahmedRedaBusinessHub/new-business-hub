'use client';

import React from 'react';

interface BreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ children, className = '' }) => (
  <nav
    className={`flex items-center space-x-2 text-sm ${className}`}
    aria-label="Breadcrumb"
  >
    {children}
  </nav>
);

interface BreadcrumbItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  children,
  isActive = false,
  className = '',
}) => (
  <li
    className={`${
      isActive
        ? 'text-gray-500 dark:text-gray-400'
        : 'text-gray-600 dark:text-gray-300'
    } ${className}`}
  >
    {children}
  </li>
);

interface BreadcrumbLinkProps {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  href,
  children,
  onClick,
  className = '',
}) => {
  const baseClass = 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors';

  if (href) {
    return (
      <a href={href} className={`${baseClass} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};
