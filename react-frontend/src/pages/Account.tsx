import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
// Íconos de Marcas
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "../assets/scss/main.scss";

const Account: React.FC = () => {
  const [userName, setUserName] = useState("Usuario");
  const [userEmail, setUserEmail] = useState("fulanita@correo.com");
  const [fullName, setFullName] = useState("Fulanita de Tal");

  // useEffect para cargar datos
  useEffect(() => {
    // Logica a implemetar para cargar datos del usuario desde la API
  }, []);

  // Función de Logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Lógica de cierre de sesión
    alert("Sesión cerrada correctamente.");
  };

  // Manejador para eliminar cuenta
  const handleDeleteAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "ADVERTENCIA: ¿Estás seguro de que deseas ELIMINAR tu cuenta? Esta acción es irreversible."
    );

    if (confirmDelete) {
      alert("Cuenta eliminada permanentemente.");
    }
  };

  return (
    <>
      <main>
        <section className="profile-section">
          <div className="profile-container">
            <h1 className="profile-title">Mi Cuenta</h1>

            <div className="profile-header">
              <img
                src="img/fotoPerfil.png"
                alt="Foto de Perfil"
                className="user-profile-large-img"
              />
              <h2>Bienvenido/a, {userName}</h2>
            </div>

            <div className="profile-details">
              <div className="detail-group-header">
                <h3>Datos: </h3>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{fullName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Correo:</span>
                <span className="detail-value">{userEmail}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contraseña:</span>
                <span className="detail-value">••••••••••</span>
              </div>

              <div className="detail-group-header security">
                <h3>Seguridad:</h3>
              </div>
              <ul className="profile-actions">
                <li>
                  <Link to="/cambiar-password">Cambiar contraseña</Link>
                </li>
                {/*MANEJADOR DE EVENTOS */}
                <li>
                  <a
                    href="#"
                    className="danger-action"
                    onClick={handleDeleteAccount}
                  >
                    Eliminar Cuenta
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    Cerrar sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <a
        href="http://wa.me/955122100"
        target="_blank"
        className="floating-wa-btn"
        aria-label="Chatea con nosotros por WhatsApp"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>

      <footer>
        <div className="footer-content">
          <div className="footer-col info-col">
            <h3>Horario de atención</h3>
            <p>Lunes a Sábado: 9:00 am - 8:00 pm</p>
            <p>Domingos y feriados: 10:00 am - 7:00 pm</p>
          </div>

          <div className="footer-col info-col">
            <Link to="/contacto" className="footer-title-link">
              <FontAwesomeIcon icon={faLink} /> Contacto
            </Link>
          </div>

          <div className="footer-col info-col">
            <Link to="/tiendas" className="footer-title-link">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección física
            </Link>
          </div>

          <div className="footer-col social-col">
            <h3>Síguenos en nuestras redes sociales</h3>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/LaCasadelChantillyOficial"
                className="social-icon facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="https://instagram.com/lacasadelchantilly"
                className="social-icon instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://tiktok.com/@lacasadelchantilly_ofi"
                className="social-icon tiktok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            LA CASA DEL CHANTILLY S.A.C. | 20552150148 © Todos los derechos
            reservados
          </p>
          <p className="web-design">Diseño web: Husky</p>
        </div>
      </footer>
    </>
  );
};

export default Account;
