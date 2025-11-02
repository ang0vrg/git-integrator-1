import simpleRestProvider from 'ra-data-simple-rest';

// Proveedor de datos básico que apunta a la API. Ajusta la URL base si tu Quarkus expone
// los endpoints en otra ruta (por ejemplo '/api').
const apiUrl = '/api';
const proveedorDatos = simpleRestProvider(apiUrl);

export default proveedorDatos;
