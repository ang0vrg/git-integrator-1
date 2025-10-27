// react-frontend\src\components\Login\Login.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; 
import MessagePopup from '../components/common/MessagePopup';
//import '../../assets/scss/main.scss';

interface LoginFormState {
    email: string;
    password: string;
}

const Login: FC = () => {
    const navigate = useNavigate();
    
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

            const data = await response.json();

            if (response.ok && data.ok) {
              // data.ok viene del backend
              localStorage.setItem("token", data.token);
              localStorage.setItem("role", data.role);
              setMessage("Inicio de sesión exitoso. Redireccionando...");
              setIsError(false);
              navigate("/home");
            } else {
              // error normal
              setMessage(`Error: ${data.msg || "Credenciales inválidas."}`);
              setIsError(true);
            }
        } catch (error) {
            setMessage('Error de red. Asegúrate de que el backend de Quarkus esté corriendo.');
            setIsError(true);
        }
    };

    // NUEVAS FUNCIONES CON useNavigate
    const switchToRegister = () => navigate('/register');
    const switchToForgotPassword = () => navigate('/forgot-password');

    return (
        <div className="my-login">
            <h2>Bienvenido</h2>
            <p>Ingresa para comprar y administrar tus pedidos</p>

            <LoginForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                switchToRegister={switchToRegister} 
                switchToForgotPassword={switchToForgotPassword} // NUEVO PROP
            />
            
            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

// MANTENER estos tipos si se usan en otros archivos
type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

export default Login;