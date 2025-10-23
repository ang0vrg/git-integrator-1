import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
/* PARA QUE LOS ICONOS DE FONT AWESOME FUNCIONEN: 
    1. Asegúrate de tener Node.js instalado.
    2. Ejecuta 'npm install' en la terminal de la raíz del proyecto.
    3. Si F.A. aún no está instalado, corre:npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome @fortawesome/free-brands-svg-icons
*/

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "../assets/scss/main.scss";

const Home: React.FC = () => {
  //ESTADO PARA EL POP-UP
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  //EFECTO PARA MOSTRAR EL POP-UP
  useEffect(() => {
    //Temporizador para mostrar el pop-up después de 2 segundos
    const timer = setTimeout(() => {
      setIsPromoOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  //FUNCIÓN PARA CERRAR EL POP-UP
  const closePromo = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPromoOpen(false);
  };

  return (
    <>
      <main>
        <section className="hero-banner">
          <div className="hero-text hero-box">
            <h1>
              Revoluciona tus <br />
              sentidos con sabores <br />
              <span className="highlight">QUE INSPIRAN...</span>
            </h1>
          </div>
          <div className="hero-content hero-content-box">
            <div className="hero-video-container">
              <video autoPlay loop muted playsInline className="hero-video">
                <source src="img/inicioVideo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section className="productos-destacados">
          <h2>¡Lo más vendido!</h2>
          <div className="carousel-container">
            <button className="carousel-btn prev-btn" aria-label="Anterior">
              &#10094;
            </button>
            <div className="carousel-track" id="carouselTrack">
              <div className="card">
                <img src="img/img1.jpg" alt="Torta" />
                <h3>Torta Helada</h3>
                <p>S/ 50.00</p>
              </div>
              <div className="card">
                <img src="img/img2.jpg" alt="Torta" />
                <h3>Tres leches de Pisco Sour</h3>
                <p>S/ 50.00</p>
              </div>
              <div className="card">
                <img src="img/img3.jpg" alt="Torta" />
                <h3>Torta Calabacin</h3>
                <p>S/ 45.00</p>
              </div>
              <div className="card">
                <img src="img/img4.jpg" alt="Torta" />
                <h3>Naked de Toffe</h3>
                <p>S/ 55.00</p>
              </div>
              <div className="card">
                <img src="img/img5.png" alt="Torta" />
                <h3>Torta de Chocolate</h3>
                <p>S/ 60.00</p>
              </div>
            </div>
            <button className="carousel-btn next-btn" aria-label="Siguiente">
              &#10095;
            </button>
          </div>
          <Link to="/productos" className="btn">
            Ver más
          </Link>
        </section>

        {isPromoOpen && (
          <div id="promoEmergente" className="VentanaEmergente active">
            <div className="promo-content">
              <span className="close-btn" onClick={closePromo}>
                &times;
              </span>
              <h2>¡Endulza tus promos!</h2>
              <div className="promo-grid">
                <div className="promo-card" data-product="Torta Helada">
                  <img src="img/promoEmer.jpg" alt="Torta Helada Promo" />
                  <h4>45% en cuchareables</h4>
                </div>
                <div className="promo-card" data-product="Pisco Sour">
                  <img src="img/promoEmer2.jpg" alt="Tres Leches Promo" />
                  <h4>🚨¡SOLO POR HOY!🚨</h4>
                </div>
                <div className="promo-card" data-product="Torta Calabacin">
                  <img src="img/promoEmer3.jpg" alt="Torta Calabacín Promo" />
                  <h4>Aprovecha el 20% de descuento</h4>
                </div>
              </div>
              <p>¡Haz clic en una promoción para más detalles!</p>
              {/* Manejador de eventos*/}
              <Link
                to="/productos"
                className="btn promo-btn"
                onClick={closePromo}
              >
                Ver todas las promociones
              </Link>
            </div>
          </div>
        )}
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

export default Home;
