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
    onInput
}) => (
    <div className="c-input-item">
        <label htmlFor={id}>{label}</label>
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
        />
        {/* Enlace por hacer */}
        {linkText && linkHref && (
            <a href={linkHref}>{linkText}</a>
        )}
    </div>
);

export default FormInput;