import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import MessagePopup from '../common/MessagePopup';
import '../../assets/css/register.css';

const Register = ({ switchToLogin }) => {
    // 1. Lógica Estado
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
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

        const password = formData.password.trim(); 
        const confirmPassword = formData.confirmPassword.trim();

        // Validación de contraseñas
        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setIsError(true);
            return; 
        }

        // Datos limpios a enviar al backend
        const dataToSubmit = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(), 
            phone: formData.phone.trim(),
            password: password, 
            // No se envía confirmPassword al backend si ya está validado,
            // pero lo incluimos si el backend de Quarkus lo requiere para el DTO.
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
            const responseBody = await response.text();
            if (response.ok) {
                const jwtToken = responseBody;
                // Auto-Login: Almacenar token y redirigir
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

    // 4. Renderizado (Composición de componentes)
    return (
        <div className="my-register">
            {/* Título y descripción */}
            <h2>Crear Cuenta</h2>
            <p>Regístrate para comprar y acumular puntos con tus pedidos</p>

            {/* Componente del Formulario */}
            <RegisterForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                switchToLogin={switchToLogin} 
            />
            
            {/* Componente del Mensaje */}
            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

export default Register;