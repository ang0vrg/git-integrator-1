// /react-frontend/src/components/Register/Register.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm'; 
import MessagePopup from '../components/common/MessagePopup';
import '../assets/scss/main.scss';

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
        firstName: '',
        lastName: '',
        email: '',
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

      setFormData((prevState) => ({
        ...prevState,
        [name as keyof RegisterFormState]: value,
      }));
    };

    const handleSubmit: SubmitHandler = async (event) => {
        event.preventDefault();
        setMessage('');

        console.log('📤 Datos a enviar:', formData);

        const password = formData.password.trim(); 
        const confirmPassword = formData.confirmPassword.trim();

        if (password !== confirmPassword) {
            setMessage('Las contraseñas NO coinciden.');
            setIsError(true);
            return; 
        }
        
        const dataToSubmit:RegisterFormState = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(), 
            phone: formData.phone.trim(),
            password: password, 
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
            const responseBody: string = await response.text();
            
            if (response.ok) {
                const jwtToken: string = responseBody;
                localStorage.setItem('jwt', jwtToken);
                setMessage('Registro exitoso. Iniciando sesión...');
                setIsError(false);
                navigate('/'); // CAMBIO: usa navigate en lugar de window.location
            } else {
                setMessage(`Error de registro: ${responseBody || 'Ocurrió un error al crear la cuenta.'}`);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Error de red. Asegúrate de que el backend de Quarkus esté corriendo.');
            setIsError(true);
        }
    };

    const switchToLogin = () => navigate('/login');

    return (
        <div className="my-register">
            <h2>Crear Cuenta</h2>
            <p>Regístrate para comprar y acumular puntos con tus pedidos</p>

            <RegisterForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                switchToLogin={switchToLogin} 
            />
            
            <MessagePopup 
                message={message} 
                isError={isError} 
            />
        </div>
    );
};

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: FormEvent<HTMLFormElement>) => Promise<void>;

export default Register;