// frontend/src/App.tsx

import React, { useState } from 'react';

import Login from './components/Login/Login'; 
import Register from './components/Register/Register';
import './App.css'; 

type NavigationHandler = (e?: React.MouseEvent) => void; 

interface LoginProps {
    switchToRegister: NavigationHandler;
}

interface RegisterProps {
    switchToLogin: NavigationHandler;
}

function App(): React.ReactElement { 
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  const switchToRegister: NavigationHandler = (e) => {
    if (e) e.preventDefault();
    setCurrentPage('register');
  };

  const switchToLogin: NavigationHandler = (e) => {
    if (e) e.preventDefault();
    setCurrentPage('login');
  };

  const LoginTyped = Login as unknown as React.FC<LoginProps>;
  const RegisterTyped = Register as unknown as React.FC<RegisterProps>;


  return (
    <div className="app-container">
      {currentPage === 'login' ? (
        <LoginTyped switchToRegister={switchToRegister} />
      ) : (
        <RegisterTyped switchToLogin={switchToLogin} />
      )}
      
    </div>
  )
}

export default App;