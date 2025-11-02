export const ROLE_ROUTES = {
  cliente: ["/account", "/cart", "/pay"],
  trabajador: ["/account", "/worker/reports", "/worker/reports/users"],
  administrador: [
    "/account",
    "/admin/reports",
    "/admin/reports/users",
    "/worker/reports", // el admin también ve reports de worker
    "/worker/reports/users",
  ],
} as const;
