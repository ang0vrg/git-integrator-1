import React, { useState } from 'react';
import LoginForm from './LoginForm';
import MessagePopup from '../common/MessagePopup';
import '../../assets/css/login.css';

const Login = ({ switchToRegister }) => {
    // 1. Lógica Estado
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // 2. Lógica Manejo de Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 3. Lógica Autenticación
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(''); 

        try {
            const dataToSubmit = {
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

            const responseBody = await response.text(); 

            if (response.ok) {
                const jwtToken = responseBody;
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

    // 4. Renderizado
    return (
        <div className="my-login">
            {/* Título y descripción */}
            <h2>Bienvenido</h2>
            <p>Ingresa para comprar y administrar tus pedidos</p>

            {/* Componente del Formulario */}
            <LoginForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                switchToRegister={switchToRegister} 
            />
            
            {/* Componente del Mensaje */}
            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

export default Login;