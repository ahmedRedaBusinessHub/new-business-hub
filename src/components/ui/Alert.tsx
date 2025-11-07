'use client';

import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

const textClasses = {
  default: 'text-gray-800 dark:text-gray-200',
  success: 'text-green-800 dark:text-green-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  error: 'text-red-800 dark:text-red-200',
  info: 'text-blue-800 dark:text-blue-200',
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'default',
  className = '',
}) => (
  <div
    className={`border rounded-lg p-4 ${variantClasses[variant]} ${textClasses[variant]} ${className}`}
    role="alert"
  >
    {children}
  </div>
);

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = '' }) => (
  <h5 className={`mb-1 font-semibold leading-none tracking-tight ${className}`}>{children}</h5>
);

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = '',
}) => <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>;
