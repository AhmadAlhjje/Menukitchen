import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'ready' | 'default' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-md';

  const variantClasses = {
    new: 'bg-accent text-white',
    ready: 'bg-success text-white',
    default: 'bg-border text-text',
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-white',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};
