import React from 'react';
import FormInput from '../common/FormInput';

const LoginForm = ({ formData, handleChange, handleSubmit, switchToRegister }) => {
    return (
        <div className="my-formbox">
            <form onSubmit={handleSubmit} className="my-input">
                
                {/* Input de Correo */}
                <FormInput
                    label="Correo Electrónico"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={true}
                />

                {/* Input de Contraseña */}
                <FormInput
                    label="Contraseña"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    required={true}
                    linkText="¿Olvidaste tu contraseña?"
                    linkHref="/reset-password.html"
                />

                {/* Botón */}
                <div className="my-login__button">
                    <button type="submit">Iniciar Sesión</button>
                </div>
            </form>

            <p>
                ¿No tienes una cuenta? <a href="#" onClick={switchToRegister}>Regístrate aquí</a>
            </p>
        </div>
    );
};

export default LoginForm;