import React from 'react';

const FormInput = ({ label, id, type, name, value, onChange, placeholder, autoComplete, linkText, linkHref, required = false }) => (
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
            required={required}
        />
        {/* Enlace,"¿Olvidaste tu contraseña?" */}
        {linkText && linkHref && (
            <a href={linkHref}>{linkText}</a>
        )}
    </div>
);

export default FormInput;