// /react-frontend/src/components/Register/Register.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import RegisterForm from './RegisterForm'; 
import MessagePopup from '../common/MessagePopup';
import '../../assets/scss/main.scss';

interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

type LoginSwitchHandler = (e?: React.MouseEvent) => void; 

interface RegisterProps {
    switchToLogin: LoginSwitchHandler;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

const Register: FC<RegisterProps> = ({ switchToLogin }) => {
    
    const [formData, setFormData] = useState<RegisterFormState>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    const handleChange: ChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name as keyof RegisterFormState]: value
        }));
    };

    const handleSubmit: SubmitHandler = async (event) => {
        event.preventDefault();
        setMessage('');

        console.log('📤 Datos a enviar:', formData);

        const password = formData.password.trim(); 
        const confirmPassword = formData.confirmPassword.trim();

        if (password !== confirmPassword) {
            setMessage('Las contraseñas NO coinciden. Revisa la consola para los códigos de caracteres.');
            setIsError(true);
            return; 
        }
        
        const dataToSubmit:RegisterFormState = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(), 
            phone: formData.phone.trim(),
            password: password, 
            confirmPassword: confirmPassword
        };

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });
            const responseBody: string = await response.text();
            
            if (response.ok) {
                const jwtToken: string = responseBody;
                localStorage.setItem('jwt', jwtToken);
                setMessage('Registro exitoso. Iniciando sesión...');
                setIsError(false);
                window.location.href = '/'; 
            } else {
                setMessage(`Error de registro: ${responseBody || 'Ocurrió un error al crear la cuenta.'}`);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Error de red. Asegúrate de que el backend de Quarkus esté corriendo.');
            setIsError(true);
        }
    };

    return (
        <div className="my-register">
            <h2>Crear Cuenta</h2>
            <p>Regístrate para comprar y acumular puntos con tus pedidos</p>

            <RegisterForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                switchToLogin={switchToLogin} 
            />
            
            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

export default Register;