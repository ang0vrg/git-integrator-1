import React, { useState } from 'react';
import '../assets/css/login.css';

const Login = ({ switchToRegister }) => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    // Estado para manejar los mensajes de respuesta y errores
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Maneja los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Maneja el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(''); // Limpiar mensajes anteriores

        try {
            // Limpiamos los espacios en el email y password antes de enviar
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
                // Guardar el token en localStorage para mantener la sesión
                localStorage.setItem('jwt', jwtToken);

                setMessage('Inicio de sesión exitoso. Redireccionando...');
                setIsError(false);

                // Redirigir al usuario al área protegida (La prinicipal)
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

            <div className="my-formbox">
                <form onSubmit={handleSubmit} className="my-input">
                    {/* Correo */}
                    <div className="c-input-item">
                        <label htmlFor="email">Correo Electrónico</label>
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

                    {/* Contraseña */}
                    <div className="c-input-item">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Tu contraseña"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <a href="/reset-password.html">¿Olvidaste tu contraseña?</a>
                    </div>

                    {/* Botón */}
                    <div className="my-login__button">
                        <button type="submit">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
            
            <p>¿No tienes una cuenta? <a href="#" onClick={switchToRegister}>Regístrate aquí</a></p>

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

export default Login;