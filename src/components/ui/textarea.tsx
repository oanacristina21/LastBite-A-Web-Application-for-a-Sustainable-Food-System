// src/components/ui/textarea.tsx
import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange, placeholder, rows = 4, className }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`px-4 py-2 border rounded-lg ${className}`}
    />
  );
};

export default Textarea;
