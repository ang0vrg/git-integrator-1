import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessagePopup from '../common/MessagePopup';
//import '../assets/scss/main.scss';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        
        if (newPassword !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            setIsError(true);
            return;
        }

        if (newPassword.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres');
            setIsError(true);
            return;
        }

        try {
            const response = await fetch('/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token, 
                    newPassword, 
                    confirmPassword 
                }),
            });
            
            const responseText = await response.text();
            
            if (response.ok) {
                setMessage('Contraseña actualizada correctamente. Redirigiendo...');
                setIsError(false);
                setTimeout(() => navigate('/login'), 2000);
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
                <h2>Restablecer Contraseña</h2>
                <p>Crea una nueva contraseña para tu cuenta</p>

                <div className="my-formbox">
                    <form onSubmit={handleSubmit} className="my-input">
                        <div className="c-input-item">
                            <label>Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        
                        <div className="c-input-item">
                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite tu contraseña"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="my-login__button">
                            <button type="submit">Restablecer Contraseña</button>
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

export default ResetPassword;