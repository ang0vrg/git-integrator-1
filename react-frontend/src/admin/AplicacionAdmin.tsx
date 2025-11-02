import React from 'react';
import { Admin, Resource } from 'react-admin';
import proveedorDatos from './ProveedorDatos';
import ListaProductos from './productos/ListaProductos';
import EditarProducto from './productos/EditarProducto';
import CrearProducto from './productos/CrearProducto';

// Aplicación principal del panel de administración (nombres en español)
export default function AplicacionAdmin() {
  // Do not pass an authProvider to Admin here — authentication is handled
  // by the application's existing login flow and ProtectedRoute wrapping
  // the `/admin/*` route. Removing authProvider prevents react-admin from
  // showing its own login page and uses the app's auth instead.
  return (
    <Admin dataProvider={proveedorDatos} basename="/admin">
      <Resource
        name="productos"
        list={ListaProductos}
        edit={EditarProducto}
        create={CrearProducto}
      />
      {/* Puedes añadir más recursos: usuarios, pedidos, reportes, etc. */}
    </Admin>
  );
}
