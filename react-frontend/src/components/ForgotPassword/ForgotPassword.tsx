import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessagePopup from '../common/MessagePopup';
//import '../assets/scss/main.scss';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const response = await fetch('/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });
            
            const responseText = await response.text();
            
            if (response.ok) {
                setMessage('Si el correo está registrado, recibirás un enlace de recuperación');
                setIsError(false);
                // Opcional: redirigir después de 3 segundos no se si agregarle un icono de carga
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage(`Error: ${responseText}`);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Error de conexión. Verifica que el backend esté funcionando.');
            setIsError(true);
        }
    };

    return (
        <div className="my-auth-container">
            <div className="my-login">
                <h2>Recuperar Contraseña</h2>
                <p>Ingresa tu correo electrónico para recibir un enlace de recuperación</p>

                <div className="my-formbox">
                    <form onSubmit={handleSubmit} className="my-input">
                        <div className="c-input-item">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu.correo@ejemplo.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                        
                        <div className="my-login__button">
                            <button type="submit">Enviar Enlace de Recuperación</button>
                        </div>
                    </form>

                    <p>
                        <a href="#" onClick={() => navigate('/login')}>
                            ← Volver al Inicio de Sesión
                        </a>
                    </p>
                </div>
            </div>

            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

export default ForgotPassword;