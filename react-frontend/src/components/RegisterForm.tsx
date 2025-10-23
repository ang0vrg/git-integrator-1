// /react-frontend/src/components/Register/RegisterForm.tsx
import React, { ChangeEvent, FormEvent, FC  } from 'react';
import FormInput from './common/FormInput'; 

interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;
type LoginSwitchHandler = (e?: React.MouseEvent) => void;

interface RegisterFormProps {
    formData: RegisterFormState;
    handleChange: ChangeHandler;
    handleSubmit: SubmitHandler;
    switchToLogin: LoginSwitchHandler;
}

const RegisterForm: FC<RegisterFormProps> = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    switchToLogin 
}) => {
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
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange} // Mantiene el handleChange normal
                    onInput={(e) => {
                        const input = e.currentTarget;
                        let value = input.value;

                        // Permitir solo números y +
                        value = value.replace(/[^0-9+]/g, '');

                        // Manejar múltiples +
                        if ((value.match(/\+/g) || []).length > 1) {
                            // Si hay múltiples +, tomar solo el primero y los números después
                            const firstPlusIndex = value.indexOf('+');
                            const afterFirstPlus = value.slice(firstPlusIndex + 1).replace(/[^0-9]/g, '');
                            value = '+' + afterFirstPlus;
                        } else if (!value.startsWith('+') && value.length > 0) {
                            // Si no empieza con + pero tiene contenido, agregar +
                            value = '+' + value.replace(/[^0-9]/g, '');
                        }
                        // Limitar longitud
                        value = value.slice(0, 16);
                        input.value = value;
                    }}
                    pattern="\+[0-9]{7,15}"
                    title="Formato: + seguido de 7 a 15 dígitos"
                    autoComplete="tel"
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