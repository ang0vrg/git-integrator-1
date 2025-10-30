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
