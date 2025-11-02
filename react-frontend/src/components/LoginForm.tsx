import React, { ChangeEvent, FormEvent, FC } from 'react';
import FormInput from './common/FormInput';
import "../App.css";
// Interfaces y tipos
interface LoginFormState {
    email: string;
    password: string;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;

interface LoginFormProps {
    formData: LoginFormState;
    handleChange: ChangeHandler;
    handleSubmit: SubmitHandler;
    switchToRegister: () => void;
    switchToForgotPassword: () => void;
    loading:boolean;
}

const LoginForm: FC<LoginFormProps> = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    switchToRegister,
    switchToForgotPassword,
    loading
}) => {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        {/* Inputs */}
        <FormInput
          label="Correo Electrónico"
          id="email"
          type="email"
          name="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Contraseña"
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Olvidaste contraseña */}
        <div className="text-right -mt-3">
          <button
            type="button"
            onClick={switchToForgotPassword}
            className="text-sm text-sky-400 hover:underline hover:text-cyan-300 font-medium"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón principal */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold text-white transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary bg-red-700 hover:bg-red-500"
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
            "Iniciar Sesión"
          )}
        </button>

        {/* Registro */}
        <p className="text-center text-sm text-white/80">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-sm text-sky-400 hover:underline hover:text-cyan-300 font-medium"
          >
            Regístrate aquí
          </button>
        </p>
      </form>
    );
};

export default LoginForm;