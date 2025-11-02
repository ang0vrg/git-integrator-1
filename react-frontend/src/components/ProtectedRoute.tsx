// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // roles permitidos, opcional
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  // Mecanismo de bypass para desarrollo: si VITE_DISABLE_AUTH=true en .env
  // o si localStorage tiene 'dev_skip_auth' a 'true', entonces no se exige login.
  const metaEnv = (import.meta as any).env || {};
  const disableAuth = metaEnv?.VITE_DISABLE_AUTH === "true" ||
    localStorage.getItem("dev_skip_auth") === "true";

  // Additional developer convenience: when running in dev and the path is
  // the admin panel, allow access without token. This lets you open `/admin`
  // during local development without changing the global auth flow.
  try {
    const isDev = !!metaEnv?.DEV || metaEnv?.VITE_DISABLE_AUTH === "true";
    const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    if (isDev && isAdminPath) {
      return <>{children}</>;
    }
  } catch (e) {
    // ignore in environments without window
  }

  if (disableAuth) {
    return <>{children}</>;
  }

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔹 1. Verifica existencia de token
  if (!token) {
    localStorage.removeItem("role"); // Limpia datos residuales
    return <Navigate to="/login" replace />;
  }

  // 🔹 2. Verifica roles permitidos si se especifican
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/403" replace />; // Página 403 prohibido (mejor UX)
    }
  }

  // 🔹 3. Todo correcto → renderiza hijos
  return <>{children}</>;
};
