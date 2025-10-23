import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Íconos Sólidos (fas)
import { faLink, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "../assets/scss/main.scss";

const Pay: React.FC = () => {
  const [producto, setProducto] = useState("Torta Clásica");
  const [subtotal, setSubtotal] = useState(50.0);
  const [total, setTotal] = useState(50.0);
  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    // Validación de tarjeta y procesamiento de pago real aquí
    console.log("Procesando pago...");
    alert(
      `Pago de S/ ${total.toFixed(
        2
      )} procesado (simulado). ¡Gracias por su compra!`
    );
    // Redireccionar al usuario a la página de confirmación
  };

  return (
    <>
      <main>
        <section className="pago">
          <h1>Resumen de su compra</h1>
          <div className="resumen">
            <p>
              <strong>Producto:</strong> {producto}
            </p>
            <p>
              <strong>Subtotal:</strong> S/ {subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> S/ {total.toFixed(2)}
            </p>
          </div>
          <h2>Formas de Pago</h2>
          <form onSubmit={handlePayment}>
            <input type="text" placeholder="Nombre completo" required />
            <input type="text" placeholder="Número de tarjeta" required />
            <input type="text" placeholder="MM/AA" required />
            <input type="text" placeholder="CVV" required />
            <button type="submit" className="btn">
              Pagar
            </button>
          </form>
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

export default Pay;
