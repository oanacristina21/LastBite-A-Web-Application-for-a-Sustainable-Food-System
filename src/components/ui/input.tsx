import React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ type = 'text', className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`px-4 py-2 border rounded-lg ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
