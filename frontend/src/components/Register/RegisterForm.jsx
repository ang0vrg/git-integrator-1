import React from 'react';
import FormInput from '../common/FormInput'; 

const RegisterForm = ({ formData, handleChange, handleSubmit, switchToLogin }) => {
    return (
        <div className="my-formbox">
            <form onSubmit={handleSubmit} className="my-input">
                
                {/* 1. Nombre */}
                <FormInput
                    label={<span>Nombre <em className="required">*</em></span>}
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={true}
                    maxLength="50"
                />

                {/* 2. Apellido */}
                <FormInput
                    label={<span>Apellido <em className="required">*</em></span>}
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={true}
                    maxLength="50"
                />

                {/* 3. Correo Electrónico */}
                <FormInput
                    label={<span>Correo Electrónico <em className="required">*</em></span>}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={true}
                />

                {/* 4. Celular */}
                <FormInput
                    label={<span>Celular <em className="required">*</em></span>}
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Tu número de celular"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="20"
                />

                {/* 5. Contraseña */}
                <FormInput
                    label={<span>Contraseña <em className="required">*</em></span>}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    required={true}
                    minLength="8"
                />

                {/* 6. Confirmar Contraseña */}
                <FormInput
                    label={<span>Confirmar Contraseña <em className="required">*</em></span>}
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={true}
                />

                {/* Botón */}
                <div className="my-register__button">
                    <button type="submit">Registrarse</button>
                </div>
            </form>

            <p>
                ¿Ya tienes una cuenta? <a href="#" onClick={switchToLogin}>Inicia sesión aquí</a>
            </p>
        </div>
    );
};

export default RegisterForm;