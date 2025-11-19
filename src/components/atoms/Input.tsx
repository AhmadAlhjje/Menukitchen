import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    px-4 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-error' : 'border-gray-300'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1">{label}</label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};
