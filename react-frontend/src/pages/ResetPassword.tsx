import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormInput from "../components/common/FormInput"; 
import MessagePopup from '../components/common/MessagePopup';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
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
      <main
        className="min-h-screen flex items-center justify-center p-6
                 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/img/Background_3.jpg')",
        }}
      >
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-gray-800">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-white">
              Restablecer Contraseña
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Crea una nueva contraseña para tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <FormInput
              label="Nueva Contraseña"
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <FormInput
              label="Confirmar Contraseña"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold text-white transition
                        ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary bg-red-700 hover:bg-red-600"
                        }`}
            >
              {loading ? (
                <>
                  <svg
                    className="mr-3 h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando…
                </>
              ) : (
                "Restablecer Contraseña"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-sky-400 hover:underline hover:text-cyan-300 font-medium"
            >
              ← Volver al Inicio de Sesión
            </button>
          </p>

          <MessagePopup message={message} isError={isError} />
        </div>
      </main>
    );
};

export default ResetPassword;