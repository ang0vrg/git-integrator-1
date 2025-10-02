import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import LoginForm from './LoginForm'; 
import MessagePopup from '../common/MessagePopup';
import '../../assets/scss/main.scss';

interface LoginFormState {
    email: string;
    password: string;
}

type RegisterSwitchHandler = (e?: React.MouseEvent) => void; 

interface LoginProps {
    switchToRegister: RegisterSwitchHandler;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;


const Login: FC<LoginProps> = ({ switchToRegister }) => {
    
    const [formData, setFormData] = useState<LoginFormState>({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    const handleChange: ChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit: SubmitHandler = async (event) => {
        event.preventDefault();
        setMessage(''); 

        try {
            const dataToSubmit: LoginFormState = {
                email: formData.email.trim(),
                password: formData.password.trim(),
            };

            const response = await fetch('/auth/login', {
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

                setMessage('Inicio de sesión exitoso. Redireccionando...');
                setIsError(false);

                window.location.href = '/'; 

            } else {
                setMessage(`Error: ${responseBody || 'Credenciales inválidas o error desconocido.'}`);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Error de red. Asegúrate de que el backend de Quarkus esté corriendo.');
            setIsError(true);
        }
    };

    return (
        <div className="my-login">
            <h2>Bienvenido</h2>
            <p>Ingresa para comprar y administrar tus pedidos</p>

            <LoginForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                switchToRegister={switchToRegister} 
            />
            
            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

export default Login;