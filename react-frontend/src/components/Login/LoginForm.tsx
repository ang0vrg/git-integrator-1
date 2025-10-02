import React, { ChangeEvent, FormEvent, FC } from 'react';
import FormInput from '../common/FormInput'; 

interface LoginFormState {
    email: string;
    password: string;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;
type RegisterSwitchHandler = (e?: React.MouseEvent) => void;

interface LoginFormProps {
    formData: LoginFormState;
    handleChange: ChangeHandler;
    handleSubmit: SubmitHandler;
    switchToRegister: RegisterSwitchHandler;
}

const LoginForm: FC<LoginFormProps> = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    switchToRegister 
}) => {
    return (
        <div className="my-formbox">
            {/* El evento onSubmit debe usar handleSubmit, que está tipado para FormEvent<HTMLFormElement> */}
            <form onSubmit={handleSubmit} className="my-input">
                
                {/* Input de Correo */}
                <FormInput
                    label="Correo Electrónico"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    autoComplete="email"
                    // TypeScript sabe que formData.email es un string
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
                    // TypeScript sabe que formData.password es un string
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