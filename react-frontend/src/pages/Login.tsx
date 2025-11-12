// react-frontend\src\components\Login\Login.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import MessagePopup from "../components/common/MessagePopup";
//import '../../assets/scss/main.scss';

interface LoginFormState {
  email: string;
  password: string;
}

const Login: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange: ChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit: SubmitHandler = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true); // ← empieza spinner

    try {
      const dataToSubmit: LoginFormState = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/home");
      } else {
        setMessage(`Error: ${data.msg || "Credenciales inválidas."}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(
        "Error de red. Asegúrate de que el backend de Quarkus esté corriendo."
      );
      setIsError(true);
    } finally {
      setLoading(false); // ← apaga spinner SIEMPRE
    }
  };

  // NUEVAS FUNCIONES CON useNavigate
  const switchToRegister = () => navigate("/register");
  const switchToForgotPassword = () => navigate("/forgot-password");

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/img/Background_1.jpg')",
      }}
    >
      {/* Caja oscura con blur */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold drop-shadow-md">
            Bienvenido de nuevo
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Ingresa para comprar y administrar tus pedidos
          </p>
        </div>

        <LoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          switchToRegister={switchToRegister}
          switchToForgotPassword={switchToForgotPassword}
          loading={loading}
        />

        <MessagePopup message={message} isError={isError} />
      </div>
    </main>
  );
};

// MANTENER estos tipos si se usan en otros archivos
type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

export default Login;
