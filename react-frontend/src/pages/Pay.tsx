import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Íconos Sólidos (fas)
import {
  faMapMarkerAlt,
  faCreditCard, // Icono para tarjeta
  faShoppingCart, // Icono de carrito
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "../App.css";

const Pay: React.FC = () => {
  // Estados simulados para el resumen de compra
  const [producto, setProducto] = useState("Torta Clásica");
  const [subtotal, setSubtotal] = useState(50.0);
  const [envio, setEnvio] = useState(10.0);
  const [total, setTotal] = useState(60.0);

  // Estados simulados para la tarjeta de crédito
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = (e: FormEvent) => {
    e.preventDefault();

    // *Validación de tarjeta y procesamiento**
    if (!cardName || cardNumber.length < 16 || !expiryDate || cvv.length < 3) {
      alert("Por favor, completa correctamente los datos de la tarjeta.");
      return;
    }

    console.log("Procesando pago...");
    // Simulación de éxito
    alert(
      `Pago de S/ ${total.toFixed(
        2
      )} procesado (simulado). ¡Gracias por su compra!`
    );
  };

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* PAY SECTION*/}
        <section className="max-w-5xl mx-auto p-5 py-10 w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-text-dark">
            Checkout y Pago
          </h1>

          {/* RESUMEN DE COMPRA */}
          <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border-l-4 border-primary">
            <h2 className="text-2xl font-bold text-text-dark mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingCart} className="text-primary" />{" "}
              Resumen de su compra
            </h2>
            <div className="space-y-2 py-4 border-t border-b border-gray-200 my-4 text-left text-lg">
              <p className="flex justify-between">
                <strong>Producto:</strong> <span>{producto} (x1)</span>
              </p>
              <p className="flex justify-between">
                <strong>Subtotal:</strong> <span>S/ {subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <strong>Costo de Envío:</strong>{" "}
                <span>S/ {envio.toFixed(2)}</span>
              </p>
            </div>
            <h3 className="text-3xl font-bold text-right text-primary mt-4">
              Total a Pagar: S/ {total.toFixed(2)}
            </h3>
          </div>

          {/* FORMULARIO DE PAGO */}
          <form
            className="bg-white p-6 rounded-lg shadow-xl space-y-6 text-left"
            onSubmit={handlePayment}
          >
            <h2 className="text-2xl font-bold text-text-dark mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCreditCard} className="text-primary" />{" "}
              Datos de Pago
            </h2>

            <div className="flex flex-col">
              <label
                htmlFor="cardName"
                className="font-semibold text-text-dark mb-1"
              >
                Nombre en la Tarjeta
              </label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Ej: JUAN PEREZ"
                required
                className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="cardNumber"
                className="font-semibold text-text-dark mb-1"
              >
                Número de Tarjeta
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                placeholder="0000 0000 0000 0000"
                required
                minLength={16}
                maxLength={16}
                className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Detalles de la Tarjeta (Fecha y CVV) - En una sola fila en escritorio */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="expiryDate"
                  className="font-semibold text-text-dark mb-1"
                >
                  Fecha de Vencimiento (MM/AA)
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  required
                  minLength={5}
                  maxLength={5}
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="cvv"
                  className="font-semibold text-text-dark mb-1"
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="123"
                  required
                  minLength={3}
                  maxLength={4}
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-secondary text-text-dark font-bold rounded-lg hover:bg-yellow-400 transition duration-300 mt-6"
            >
              Pagar S/ {total.toFixed(2)}
            </button>
          </form>
        </section>

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20tengo%20una%20consulta%20sobre%20mi%20pago."
          className="fixed bottom-6 right-6 p-4 rounded-full bg-whatsapp text-white shadow-xl hover:bg-green-600 transition duration-300 z-50 text-3xl flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          title="Chatea con nosotros por WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </main>

      {/* FOOTER */}
      <footer className="bg-text-dark text-text-light py-10">
        <div className="flex flex-wrap justify-around max-w-7xl mx-auto px-5 gap-8">
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              La Casa del Chantilly
            </h3>
            <p className="mb-2 text-sm">Endulzando tus momentos desde 1995.</p>
          </div>
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              Enlaces Rápidos
            </h3>
            <Link
              to="/inicio"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Productos
            </Link>
            <Link
              to="/nosotros"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Nosotros
            </Link>
            <Link
              to="/tiendas"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Tiendas
            </Link>
            <Link
              to="/contacto"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Contacto
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">Contáctanos</h3>
            <p className="mb-2 text-sm">
              <a
                href="mailto:ventas@chantilly.com"
                className="hover:text-primary transition"
              >
                ventas@chantilly.com
              </a>
            </p>
            <p className="mb-2 text-sm">
              <a
                href="tel:+51930263546"
                className="hover:text-primary transition"
              >
                (+51) 930 263 546
              </a>
            </p>
            <Link
              to="/tiendas"
              className="block text-sm mt-4 text-primary hover:text-white transition"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{" "}
              Dirección física
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              Síguenos en nuestras redes sociales
            </h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/LaCasadelChantillyOficial"
                className="text-2xl hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="https://instagram.com/lacasadelchantilly"
                className="text-2xl hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://tiktok.com/@lacasadelchantilly_ofi"
                className="text-2xl hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-400 px-5">
          <p>
            LA CASA DEL CHANTILLY S.A.C. | 20552150148 © Todos los derechos
            reservados
          </p>
          <p className="mt-1">Diseño web: Husky</p>
        </div>
      </footer>
    </>
  );
};


export default Pay;
