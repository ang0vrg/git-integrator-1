// /react-frontend/src/components/Register/Register.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import MessagePopup from '../components/common/MessagePopup';
import { PHONE_RULES, validatePhoneNumber } from '../utils/phoneValidation';
// import '../assets/scss/main.scss';

interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    email: '',
    country: 'PE',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
    {}
  );

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

    // Validar teléfono cuando cambia
    if (name === "phone") {
      const newPhone = value.trim();
      if (newPhone) {
        const validation = validatePhoneNumber(newPhone, formData.country);
        if (!validation.valid) {
          setFieldErrors((prev) => ({
            ...prev,
            phone: validation.error,
          }));
        } else {
          setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.phone;
            return newErrors;
          });
        }
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
    }

    // Cuando cambia el país, revalidar el teléfono actual
    if (name === "country" && formData.phone) {
      const validation = validatePhoneNumber(formData.phone, value);
      if (!validation.valid) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: validation.error,
        }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.phone;
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
    setLoading(true);

    // Validar teléfono antes de enviar
    const phoneValidation = validatePhoneNumber(formData.phone, formData.country);
    if (!phoneValidation.valid) {
      setMessage(phoneValidation.error || "Teléfono inválido");
      setIsError(true);
      setLoading(false);
      return;
    }

    console.log("📤 Datos a enviar:", formData);

    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas NO coinciden.");
      setIsError(true);
      setLoading(false);
      return;
    }

    const dataToSubmit = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password,
      confirmPassword,
    };

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json();

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
      setLoading(false);
    }
  };

  const switchToLogin = () => navigate('/login');

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://scontent.flim33-1.fna.fbcdn.net/v/t1.6435-9/36375140_1799992273372918_7615288594210488320_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Chdk0AFwB2IQ7kNvwEI9R26&_nc_oc=Adn4hM27NG95S0IT2XLmXnmOcC3pr4zQky3aFx5goDMP833N_QU0pM2peGpXqPEhj20&_nc_zt=23&_nc_ht=scontent.flim33-1.fna&_nc_gid=Nwrp9K5q319d20bbmDkXIQ&oh=00_AfaDA_8dsCkPSR1I8n1mJhkWHEL_rrWUMpz3Jot7CTSEIQ&oe=690181C7')",
      }}
    >
      {/* Caja glass blanca */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white">
            Crear Cuenta
          </h1>
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
          fieldErrors={fieldErrors}
        />

        <MessagePopup message={message} isError={isError} />
      </div>
    </main>
  );
};

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

export default Register;