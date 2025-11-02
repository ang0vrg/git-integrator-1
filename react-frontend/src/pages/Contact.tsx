// src/pages/Contact.tsx
import React, { FormEvent } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

const Contact: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Mensaje enviado. ¡Gracias por contactarnos!");
  };

  return (
    <>
      <Menu />

      <main className="min-h-screen flex flex-col bg-gray-50">
        {/* HERO */}
        <section className="relative bg-[url('/img/contact-hero.jpg')] bg-cover bg-center h-[40vh] md:h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-white text-center p-5 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              ¿Tienes alguna consulta o comentario?
            </h1>
            <p className="text-lg drop-shadow-lg">
              Nos encanta escuchar a nuestros clientes. Llena el formulario y
              nos pondremos en contacto contigo.
            </p>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className="max-w-4xl mx-auto p-5 py-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Cuéntanos tu mensaje
          </h2>

          <form
            className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 flex flex-col">
                <label className="font-semibold text-gray-800 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="font-semibold text-gray-800 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-800 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-800 mb-1">
                Teléfono (Opcional)
              </label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-800 mb-1">Asunto</label>
              <input
                type="text"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-800 mb-1">
                Mensaje
              </label>
              <textarea
                rows={5}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition"
            >
              Enviar Mensaje
            </button>
          </form>
        </section>

        {/* INFO DE CONTACTO */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Teléfono */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-rose-600 text-3xl mb-3"
              />
              <h3 className="text-xl font-bold mb-2">Llámanos</h3>
              <p className="text-gray-600">Lunes a Viernes 9am-6pm</p>
              <a
                href="tel:+51930263546"
                className="block mt-2 font-semibold text-gray-800 hover:text-rose-600"
              >
                (+51) 930 263 546
              </a>
            </div>

            {/* Correo */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-rose-600 text-3xl mb-3"
              />
              <h3 className="text-xl font-bold mb-2">Escríbenos</h3>
              <p className="text-gray-600">Respondemos en 24h</p>
              <a
                href="mailto:ventas@chantilly.com"
                className="block mt-2 font-semibold text-gray-800 hover:text-rose-600"
              >
                ventas@chantilly.com
              </a>
            </div>

            {/* Tiendas */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-rose-600 text-3xl mb-3"
              />
              <h3 className="text-xl font-bold mb-2">Puntos de Venta</h3>
              <p className="text-gray-600">Encuentra nuestras ubicaciones</p>
              <Link
                to="/tiendas"
                className="inline-flex items-center gap-2 mt-2 font-semibold text-gray-800 hover:text-rose-600"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Ver Tiendas
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer único */}
      <Footer />
    </>
  );
};

export default Contact;
