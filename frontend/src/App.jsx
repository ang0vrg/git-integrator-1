// frontend/src/App.jsx
import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'; 

function App() {
  // Estado para controlar qué componente mostrar: 'login' o 'register'
  const [currentPage, setCurrentPage] = useState('login');

  const switchToRegister = (e) => {
    if (e) e.preventDefault();
    setCurrentPage('register');
  };

  const switchToLogin = (e) => {
    if (e) e.preventDefault();
    setCurrentPage('login');
  };

  return (
    <div className="app-container">
      {currentPage === 'login' ? (
        <Login switchToRegister={switchToRegister} />
      ) : (
        <Register switchToLogin={switchToLogin} />
      )}
      
    </div>
  )
}

export default App;