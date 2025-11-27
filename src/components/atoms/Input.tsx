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
    px-4 py-2.5 border rounded-lg text-text
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
    disabled:bg-gray-100 disabled:cursor-not-allowed
    placeholder:text-text-muted
    ${error ? 'border-error bg-error/5' : 'border-border bg-white hover:border-primary/50'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-text mb-2">{label}</label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className="mt-1.5 text-sm text-error font-medium">{error}</p>}
    </div>
  );
};
