'use client';

import React from 'react';
import { Card } from '../atoms/Card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'accent';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  onClick,
}) => {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    accent: 'bg-accent',
  };

  return (
    <Card hoverable={!!onClick} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-text">{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
