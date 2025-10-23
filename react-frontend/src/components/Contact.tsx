import React, { FormEvent } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faCheckCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "../assets/scss/main.scss";

const Contact: React.FC = () => {
  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log("Formulario de Contacto Enviado.");
    alert("Mensaje enviado. ¡Gracias por contactarnos!");
  };

  return (
    <>
      <main>
        <section className="contact-form-section">
          <h3 id="form-title">Cuéntanos tu mensaje</h3>

          <div id="success-message" className="success-message">
            <h2>¡Gracias por contactar con nosotros!</h2>
            <p>Nos pondremos en contacto contigo muy pronto.</p>
            <div className="success-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
          </div>

          <div id="form-container">
            <form
              id="contact-form"
              action="#"
              method="post"
              className="contact-form"
              onSubmit={handleFormSubmit}
            >
              <div className="form-group">
                <label className="group-label">Datos Personales *</label>
                <div className="name-fields">
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    placeholder="Nombres completos"
                    required
                  />
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    placeholder="Apellidos completos"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto *</label>
                <input type="text" id="asunto" name="asunto" required />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Escriba su mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={6}
                  required
                ></textarea>
              </div>

              <div className="form-group captcha-group">
                <label htmlFor="captcha">Captcha de Seguridad *</label>
                <div className="captcha-field">
                  <p className="captcha-text" id="captcha-operation">
                    Cargando...
                  </p>
                  <input
                    type="text"
                    id="captcha"
                    name="captcha"
                    placeholder="Respuesta"
                    required
                    pattern="\d*"
                  />
                </div>
              </div>

              <button type="submit" className="btn contact-btn">
                ENVIAR
              </button>
            </form>
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
            <a href="contacto.html" className="footer-title-link">
              <FontAwesomeIcon icon={faLink} />
              Contacto
            </a>
          </div>

          <div className="footer-col info-col">
            <Link to="/tiendas" className="footer-title-link">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Dirección física
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

export default Contact;
