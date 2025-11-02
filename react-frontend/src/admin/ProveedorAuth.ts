import { AuthProvider } from 'react-admin';

// Proveedor de autenticación simple para react-admin. Lee el token de localStorage
// y añade control básico. Adáptalo según la forma en que manejes auth en Quarkus.
const proveedorAuth: AuthProvider = {
  login: async ({ username, password }) => {
    // Este login por defecto no realiza petición; úsalo para integrar tu endpoint de login
    // o deja que el login se gestione fuera y aquí sólo valides el token en localStorage
    localStorage.setItem('token', '');
    return Promise.resolve();
  },
  logout: async () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    return token ? Promise.resolve() : Promise.reject();
  },
  getPermissions: async () => {
    const role = localStorage.getItem('role') || 'cliente';
    return Promise.resolve(role);
  },
  checkError: async (error) => {
    // Manejar errores HTTP si es necesario
    return Promise.resolve();
  },
  getIdentity: async () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject();
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Promise.resolve({ id: payload.sub || payload.upn, fullName: payload.name });
    } catch {
      return Promise.reject();
    }
  }
};

export default proveedorAuth;
