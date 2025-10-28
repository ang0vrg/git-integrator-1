import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/common/FormInput';
import MessagePopup from '../components/common/MessagePopup';
//import '../assets/scss/main.scss';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const responseText = await response.text();

      if (response.ok) {
        setMessage(
          "Si el correo está registrado, recibirás un enlace de recuperación"
        );
        setIsError(false);
        // Opcional: redirigir después de 3 segundos no se si agregarle un icono de carga
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(`Error: ${responseText}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(
        "Error de conexión. Verifica que el backend esté funcionando."
      );
      setIsError(true);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6
                 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://scontent.flim33-1.fna.fbcdn.net/v/t1.6435-9/36375140_1799992273372918_7615288594210488320_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Chdk0AFwB2IQ7kNvwEI9R26&_nc_oc=Adn4hM27NG95S0IT2XLmXnmOcC3pr4zQky3aFx5goDMP833N_QU0pM2peGpXqPEhj20&_nc_zt=23&_nc_ht=scontent.flim33-1.fna&_nc_gid=Nwrp9K5q319d20bbmDkXIQ&oh=00_AfaDA_8dsCkPSR1I8n1mJhkWHEL_rrWUMpz3Jot7CTSEIQ&oe=690181C7')",
      }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white">
            Recuperar Contraseña
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Ingresa tu correo electrónico para recibir un enlace de recuperación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <FormInput
            label="Correo Electrónico"
            id="email"
            type="email"
            name="email"
            placeholder="tu.correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
                Enviando…
              </>
            ) : (
              "Enviar Enlace de Recuperación"
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

export default ForgotPassword;