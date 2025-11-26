// /react-frontend/src/components/Register/Register.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import MessagePopup from "../components/common/MessagePopup";

interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleChange: ChangeHandler = (e) => {
    const { name, value } = e.target;

    // Validar solo para firstName y lastName
    if (name === "firstName" || name === "lastName") {
      const lettersOnly = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

      if (!lettersOnly.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: "Solo se permiten letras",
        }));
        return;
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name as keyof RegisterFormState]: value,
    }));
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit: SubmitHandler = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true); // ← empieza spinner

    console.log("📤 Datos a enviar:", formData);

    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas NO coinciden.");
      setIsError(true);
      setLoading(false); // ← apaga aquí (early return)
      return;
    }

    const dataToSubmit: RegisterFormState = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      // 🔥 Elimina todos los espacios del número (+51 987 654 321 → +51987654321)
      phone: formData.phone.replace(/\s+/g, ""),
      password,
      confirmPassword,
    };

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json(); // ← lee JSON (igual que login)

      if (res.ok && data.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/login");
      } else {
        setMessage(`Error: ${data.msg || "No se pudo crear la cuenta."}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Error de red. Verifica que Quarkus esté activo.");
      setIsError(true);
    } finally {
      setLoading(false); // ← apaga spinner SIEMPRE
    }
  };

  const switchToLogin = () => navigate("/login");

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/img/Background_4.jpg')",
      }}
    >
      {/* Caja glass blanca */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-white/80">
            Regístrate para comprar y acumular puntos con tus pedidos
          </p>
        </div>

        <RegisterForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          switchToLogin={switchToLogin}
          loading={loading}
        />

        <MessagePopup message={message} isError={isError} />
      </div>
    </main>
  );
};

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

export default Register;
