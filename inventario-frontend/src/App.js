import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Inventario from './Inventario';
import Proveedores from './Proveedores';
import './App.css';

function App() {
    return (
        <div>
            {/* Definición de las Rutas */}
            <div className="content">
                <Routes>
                    <Route path="/inventario" element={<Inventario />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    {/* Ruta por defecto */}
                    <Route path="/" element={<Inventario />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;