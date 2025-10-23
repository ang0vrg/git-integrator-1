import React, { ChangeEvent, FormEvent, FC } from 'react';
import FormInput from './common/FormInput'; 

// Interfaces y tipos
interface LoginFormState {
    email: string;
    password: string;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;

interface LoginFormProps {
    formData: LoginFormState;
    handleChange: ChangeHandler;
    handleSubmit: SubmitHandler;
    switchToRegister: () => void;
    switchToForgotPassword: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    switchToRegister,
    switchToForgotPassword 
}) => {
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
                    // QUITAMOS linkText y linkHref de aquí
                />

                {/* Enlace "¿Olvidaste tu contraseña?" SEPARADO */}
                <div className="c-input-item" style={{ textAlign: 'right', marginTop: '-15px', marginBottom: '20px' }}>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            switchToForgotPassword();
                        }}
                        style={{ 
                            color: '#4a90e2', 
                            textDecoration: 'none',
                            fontSize: '0.9em'
                        }}
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

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