import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ROLE_PATHS: Record<string, string[]> = {
  cliente: ["/account", "/cart", "/pay"],
  trabajador: [
    "/account",
    "/worker",
    "/dashboard",
    "/admin/suppliers",
    "/admin/inventory",
    "/admin/import",
    "/admin/reports",
  ],
  administrador: ["/account", "/admin", "/worker", "/dashboard"],
};

export const ProtectedRoute = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  console.log("🔑 ProtectedRoute MONTADO – pathname:", location.pathname);

  /* 1º – aún no sabemos si hay token → no decidimos nada */
  if (user === undefined || role === undefined) {
    return <div className="p-4">Verificando sesión...</div>; // o un spinner
  }

  /* 2º – seguro: no hay login */
  if (!user || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* 3º – comprobar permisos */
  const allowed = ROLE_PATHS[role] ?? [];
  const ok = allowed.some((p) => location.pathname.startsWith(p));
  console.table({
    pathname: location.pathname,
    user,
    role,
    allowed: ROLE_PATHS[role ?? ""] ?? [],
    ok: (ROLE_PATHS[role ?? ""] ?? []).some((p) =>
      location.pathname.startsWith(p)
    ),
  });
  return ok ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};