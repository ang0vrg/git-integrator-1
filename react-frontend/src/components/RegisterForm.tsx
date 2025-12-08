// /react-frontend/src/components/Register/RegisterForm.tsx
import React, { ChangeEvent, FormEvent, FC  } from 'react';
import FormInput from './common/FormInput'; 
import { PHONE_RULES } from '../utils/phoneValidation';

interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;
type LoginSwitchHandler = (e?: React.MouseEvent) => void;

interface RegisterFormProps {
  formData: RegisterFormState;
  handleChange: ChangeHandler;
  handleSubmit: SubmitHandler;
  switchToLogin: LoginSwitchHandler;
  loading: boolean;
  fieldErrors?: { [key: string]: string };
}

const RegisterForm: FC<RegisterFormProps> = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    switchToLogin,
    loading,
    fieldErrors = {}
}) => {
    return (
      <div className="w-full flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
          {/* Inputs (sin cambios) */}
          <FormInput
            label={
              <span>
                Nombre <em className="text-red-500">*</em>
              </span>
            }
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Tu nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <FormInput
            label={
              <span>
                Apellido <em className="text-red-500">*</em>
              </span>
            }
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Tu apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <FormInput
            label={
              <span>
                Correo Electrónico <em className="text-red-500">*</em>
              </span>
            }
            id="email"
            type="email"
            name="email"
            placeholder="correo@correo.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Selector de País */}
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              País <em className="text-red-500">*</em>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              {Object.entries(PHONE_RULES).map(([code, rule]) => (
                <option key={code} value={code}>
                  {rule.countryName} ({rule.dialingCode})
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label={
              <span>
                Celular <em className="text-red-500">*</em>
              </span>
            }
            id="phone"
            type="tel"
            name="phone"
            placeholder={formData.country ? PHONE_RULES[formData.country as keyof typeof PHONE_RULES]?.dialingCode + " 987654321" : "+51 987654321"}
            value={formData.phone}
            onChange={handleChange}
            onInput={(e) => {
              const input = e.currentTarget;
              let val = input.value.replace(/[^0-9+]/g, "");
              if (!val.startsWith("+")) val = "+" + val.replace(/[^0-9]/g, "");
              val = val.slice(0, 16);
              input.value = val;
            }}
            pattern="\+[0-9]{7,15}"
            title="Formato: + seguido de 7-15 dígitos"
            autoComplete="tel"
            required
          />
          {fieldErrors.phone && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>
          )}
          <FormInput
            label={
              <span>
                Contraseña <em className="text-red-500">*</em>
              </span>
            }
            id="password"
            type="password"
            name="password"
            placeholder="••••••••••••••••"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormInput
            label={
              <span>
                Confirmar Contraseña <em className="text-red-500">*</em>
              </span>
            }
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="••••••••••••••••"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Botón con spinner */}
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
                Registrando…
              </>
            ) : (
              "Registrarse"
            )}
          </button>

          {/* Enlace a login */}
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-sm text-sky-400 hover:underline hover:text-cyan-300 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      </div>
    );
};

export default RegisterForm;