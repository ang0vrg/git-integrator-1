// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import "./App.css"; 

import Login from "./pages/Login"; 
import Register from './pages/Register';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from './pages/Home';
import Products from './pages/Products';
import Pay from './pages/Pay';
import About from './pages/About';
import Account from './pages/Account';
import Stores from './pages/Stores';
import Contact from './pages/Contact';

function App(): React.ReactElement { 
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rutas protegidas - requieren autenticación */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />

          {/* Ruta solo para clientes autenticados */}
          <Route path="/pay" element={<Pay />} />
          <Route path="/account" element={<Account />} />

          {/* Rutas para administradores */}

          {/* Rutas para trabajadores y administradores */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
