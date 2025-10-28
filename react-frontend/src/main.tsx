import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';   // ← reset / tipografía
import './App.css';      // ← carga Tailwind
import App from './App'; 

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("El elemento con id 'root' no se encontró en el documento HTML.");
}