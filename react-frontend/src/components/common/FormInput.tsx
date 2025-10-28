// /react-frontend/src/components/common/FormInput.tsx
import React, { ChangeEvent } from 'react';

interface FormInputProps {
    label: string | React.ReactNode; 
    id: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel';
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    autoComplete?: string;
    linkText?: string;
    linkHref?: string;
    required?: boolean;
    pattern?: string;
    title?: string;
    onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  linkText,
  linkHref,
  required = false,
  pattern,
  title,
  onInput,
}) => (
  <div className="w-full">
    {/* Label */}
    <label htmlFor={id} className="block text-sm text-white/80 mb-1">
      {label}
    </label>

    {/* Input glass */}
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      onInput={onInput}
      required={required}
      pattern={pattern}
      title={title}
      className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm
                 border border-white/30 rounded-lg
                 placeholder-black/50 text-black/50
                 focus:outline-none focus:ring-2 focus:ring-white
                 transition"
    />

    {/* Link opcional (por ejemplo “¿Olvidaste contraseña?”) */}
    {linkText && linkHref && (
      <div className="text-right mt-1">
        <a
          href={linkHref}
          className="text-xs text-sky-300 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            // si necesitas ejecutar una función, pásala como prop
          }}
        >
          {linkText}
        </a>
      </div>
    )}
  </div>
);

export default FormInput;