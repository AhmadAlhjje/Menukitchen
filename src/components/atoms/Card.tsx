import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-surface rounded-lg p-6 border border-border';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer' : 'shadow-sm';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
