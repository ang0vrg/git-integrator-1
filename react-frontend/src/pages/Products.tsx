import React, { useState } from "react";
import { Link } from "react-router-dom";

/* PARA QUE LOS ICONOS DE FONT AWESOME FUNCIONEN: 
    1. Asegúrate de tener Node.js instalado.
    2. Ejecuta 'npm install' en la terminal de la raíz del proyecto.
    3. Si F.A. aún no está instalado, corre:npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome @fortawesome/free-brands-svg-icons
*/

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Íconos Sólidos
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

const Products: React.FC = () => {
  return (
    <>
      <main>
        <section className="products">
          <h1>Nuestros Productos</h1>
          <div className="grid">
            <div className="card">
              <img src="img/Bocaditos.jpg" alt="Torta" />
              <h3>Torta Clásica</h3>
              <p>S/ 50.00</p>
              <Link to="/pago" className="btn">
                Comprar
              </Link>
            </div>
            <div className="card">
              <img src="assets/img/box.jpg" alt="Torta" />
              <h3>Torta Especial</h3>
              <p>S/ 65.00</p>
              <Link to="/pago" className="btn">
                Comprar
              </Link>
            </div>
            <div className="card">
              <img src="img/capibara.jpg" alt="Torta" />
              <h3>Torta Especial</h3>
              <p>S/ 65.00</p>
              <Link to="/pago" className="btn">
                Comprar
              </Link>
            </div>
            <div className="card">
              <img src="img/cheesecake.jpg" alt="Torta" />
              <h3>Torta Especial</h3>
              <p>S/ 65.00</p>
              <Link to="/pago" className="btn">
                Comprar
              </Link>
            </div>
            <div className="card">
              <img src="img/cuchareables.jpg" alt="Torta" />
              <h3>Torta Especial</h3>
              <p>S/ 65.00</p>
              <Link to="/pago" className="btn">
                Comprar
              </Link>
            </div>
            <div className="card">
              <img src="img/galletas.jpg" alt="Torta" />
              <h3>Torta Especial</h3>
              <p>S/ 65.00</p>
              <Link to="/pago" className="btn">
                Comprar
              </Link>
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

export default Products;
