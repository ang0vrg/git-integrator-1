import React from 'react';
import { Admin, Resource } from 'react-admin';
import proveedorDatos from './ProveedorDatos';
import ListaProductos from './productos/ListaProductos';
import EditarProducto from './productos/EditarProducto';
import CrearProducto from './productos/CrearProducto';

// AuthProvider de desarrollo: bypass total para poder usar el panel sin login.
const devAuthProvider = {
  login: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  checkAuth: async () => Promise.resolve(),
  checkError: async () => Promise.resolve(),
  getPermissions: async () => Promise.resolve('administrador'),
  getIdentity: async () => Promise.resolve({ id: 'dev', fullName: 'Dev User' }),
};

export default function AplicacionAdminDev() {
  return (
    // Use a distinct basename for the dev admin so it does not collide with the
    // protected `/admin` route. This prevents the app from being redirected to
    // the protected route which forces login.
    <Admin dataProvider={proveedorDatos} authProvider={devAuthProvider} basename="/admin-dev">
      <Resource
        name="productos"
        list={ListaProductos}
        edit={EditarProducto}
        create={CrearProducto}
      />
    </Admin>
  );
}
