// frontend/src/App.tsx

// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// === Importaciones de Autenticación (Existentes) ===
import Login from './components/Login/Login'; 
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

// === Importaciones de Vistas ===
import Index from './components/Index/index';
import Nosotros from './components/Nosotros/nosotros';
import Productos from './components/Productos/productos';
import Tiendas from './components/Tiendas/tiendas';
import Contacto from './components/Contacto/contacto';
import Pago from './components/Pago/pago';
import Cuenta from './components/Cuenta/cuenta';
import PersonalizarPedido from './components/PersonalizarPedido/PersonalizarPedido';

import './App.css'; 

function App(): React.ReactElement { 
  return (
    <Router>
      <div className="app-container">
        <Routes>
          
          {/*RUTAS DE ACCESO RÁPIDO*/}
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/*RUTAS DE LA PAG. PRINCIPAL*/}
          
          <Route path="/inicio" element={<Index />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/tiendas" element={<Tiendas />} />
          <Route path="/personalizar" element={<PersonalizarPedido />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/cuenta" element={<Cuenta />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App;