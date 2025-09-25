import React, { useState } from 'react';
import '../assets/css/register.css';

const Register = ({ switchToLogin }) => {
    // Estado para manejar los datos del formulario
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

    // Manejar el cambio en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        const password = formData.password.trim(); 
        const confirmPassword = formData.confirmPassword.trim();

        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setIsError(true);
            return; 
        }
        const dataToSubmit = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: password,
            confirmPassword: confirmPassword
        };

        /* Temporal
        console.log("Datos enviados al backend:", dataToSubmit);
        console.log("Password limpio:", dataToSubmit.password);
        console.log("ConfirmPassword limpio:", dataToSubmit.confirmPassword);
        */
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

                // Almacenar token y redirigir (Auto-Login)
                localStorage.setItem('jwt', jwtToken);

                setMessage('Registro exitoso. Iniciando sesión...');
                setIsError(false);

                window.location.href = '/'; 

            } else {
                // Manejar errores de backend (400 Bad Request, 409 Conflict)
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

            <div className="my-formbox">
                <form onSubmit={handleSubmit} className="my-input">
                    {/* Nombre */}
                    <div className="c-input-item">
                        <label htmlFor="firstName">Nombre <em className="required">*</em></label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Tu nombre"
                            maxLength="50"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Apellido */}
                    <div className="c-input-item">
                        <label htmlFor="lastName">Apellido <em className="required">*</em></label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Tu apellido"
                            maxLength="50"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Correo */}
                    <div className="c-input-item">
                        <label htmlFor="email">Correo Electrónico <em className="required">*</em></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Tu correo electrónico"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Celular */}
                    <div className="c-input-item">
                        <label htmlFor="phone">Celular</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Tu número de celular"
                            maxLength="20"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Contraseña */}
                    <div className="c-input-item">
                        <label htmlFor="password">Contraseña <em className="required">*</em></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Tu contraseña"
                            autoComplete="new-password"
                            minLength="8"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Confirmar contraseña */}
                    <div className="c-input-item">
                        <label htmlFor="confirmPassword">Confirmar Contraseña <em className="required">*</em></label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Repite tu contraseña"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Botón */}
                    <div className="my-register__button">
                        <button type="submit">Registrarse</button>
                    </div>
                </form>
            </div>
            
            <p>¿Ya tienes una cuenta? <a href="#" onClick={switchToLogin}>Inicia sesión aquí</a></p>

            {/* Pop-up de mensaje */}
            {message && (
                <div 
                    className={`message-popup ${isError ? 'error' : 'success'}`}
                    style={{ backgroundColor: isError ? 'red' : 'green', padding: '10px', marginTop: '15px', color: 'white', borderRadius: '4px' }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Register;