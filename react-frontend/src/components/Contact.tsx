import React, { FormEvent } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapMarkerAlt,
  faEnvelope, // Icono de correo
  faPhone, // Icono de teléfono
  faInfoCircle, // Icono de información
} from "@fortawesome/free-solid-svg-icons";

import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "./App.css";

const Contact: React.FC = () => {
  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log("Formulario de Contacto Enviado.");
    alert("Mensaje enviado. ¡Gracias por contactarnos!");
  };

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* HERO SECTION*/}
        <section className="contact-hero-section relative bg-[url('img/contact-hero.jpg')] bg-cover bg-center h-[40vh] md:h-[50vh] flex items-center justify-center contact-hero-section-after">
          <div className="z-10 text-text-light text-center p-5 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              ¿Tienes alguna consulta o comentario?
            </h2>
            <p className="text-lg drop-shadow-lg">
              Nos encanta escuchar a nuestros clientes. Llena el formulario y
              nos pondremos en contacto contigo.
            </p>
          </div>
        </section>

        {/* FORM SECTION*/}
        <section className="max-w-4xl mx-auto p-5 py-10">
          <h3
            id="form-title"
            className="text-3xl font-bold mb-6 text-text-dark"
          >
            Cuéntanos tu mensaje
          </h3>

          {/*Mensaje de exito*/}
          <div
            id="success-message"
            className="text-center p-8 border-2 border-whatsapp rounded-lg bg-green-50 shadow-lg"
            style={{ display: "none" }}
          >
            <h2 className="text-2xl font-bold text-whatsapp mb-4">
              ¡Gracias por contactar con nosotros!
            </h2>
            <p className="text-lg mb-6 text-text-dark">
              Nos pondremos en contacto contigo muy pronto.
            </p>
            <div className="success-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-3 bg-primary text-text-light font-bold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Volver a Inicio
            </Link>
          </div>

          <div id="form-container">
            <form
              className="space-y-6 mt-6 bg-white p-6 rounded-xl shadow-lg text-left"
              onSubmit={handleFormSubmit}
            >
              {/*Campo de datos*/}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="font-semibold text-text-dark mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="font-semibold text-text-dark mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Otros Campos */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="font-semibold text-text-dark mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="font-semibold text-text-dark mb-1"
                >
                  Teléfono (Opcional)
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="subject"
                  className="font-semibold text-text-dark mb-1"
                >
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="message"
                  className="font-semibold text-text-dark mb-1"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-text-light font-bold rounded-lg hover:bg-red-700 transition duration-300"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </section>

        {/*Apartado de informacion*/}
        <section className="bg-white py-12">
          <h2 className="text-3xl font-bold mb-8 text-text-dark">
            Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto text-center px-5">
            {/*Teléfono */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-primary text-3xl mb-3"
              />
              <h3 className="text-xl font-bold mb-2">Llámanos</h3>
              <p className="text-gray-600">
                Atención de Lunes a Viernes de 9am a 6pm.
              </p>
              <a
                href="tel:+51930263546"
                className="block mt-2 font-semibold text-text-dark hover:text-primary transition"
              >
                (+51) 930 263 546
              </a>
            </div>

            {/*Correo */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-primary text-3xl mb-3"
              />
              <h3 className="text-xl font-bold mb-2">Escríbenos</h3>
              <p className="text-gray-600">
                Te responderemos en un plazo máximo de 24 horas.
              </p>
              <a
                href="mailto:ventas@chantilly.com"
                className="block mt-2 font-semibold text-text-dark hover:text-primary transition"
              >
                ventas@chantilly.com
              </a>
            </div>

            {/*Tiendas */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-primary text-3xl mb-3"
              />
              <h3 className="text-xl font-bold mb-2">Puntos de Venta</h3>
              <p className="text-gray-600">
                Encuentra nuestras ubicaciones y horarios.
              </p>
              <Link
                to="/tiendas"
                className="block mt-2 font-semibold text-text-dark hover:text-primary transition"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> Ver
                Tiendas
              </Link>
            </div>
          </div>
        </section>

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20quisiera%20contactar%20con%20ustedes."
          className="fixed bottom-6 right-6 p-4 rounded-full bg-whatsapp text-white shadow-xl hover:bg-green-600 transition duration-300 z-50 text-3xl flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          title="Chatea con nosotros por WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </main>

      {/* FOOTER*/}
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

export default Contact;
