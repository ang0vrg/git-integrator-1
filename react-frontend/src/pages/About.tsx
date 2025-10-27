import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faBullseye, // Icono para Misión
    faEye // Icono para Visión
} from '@fortawesome/free-solid-svg-icons';
// Íconos de Marcas
import {
    faWhatsapp,
    faFacebookF,
    faInstagram,
    faTiktok
} from '@fortawesome/free-brands-svg-icons';
// =======================================

import "../App.css";

const About: React.FC = () => {
  //Manejo del cambio de fondo de Misión/Visión
  const [currentBackground, setCurrentBackground] = useState("");
  // Funcion para manejar el hover de Misión/Visión
  const cambiarFondo = (tipo: "mision" | "vision") => {
    setCurrentBackground(tipo);
  };

  const restaurarFondo = () => {
    setCurrentBackground("");
  };

  // Clases dinámicas de Tailwind
  const backgroundClasses =
    currentBackground === "mision"
      ? "bg-[url('img/mision-bg.jpg')] bg-cover bg-center"
      : currentBackground === "vision"
      ? "bg-[url('img/vision-bg.jpg')] bg-cover bg-center"
      : "bg-[url('img/nosotros-hero-default.jpg')] bg-cover bg-center"; // Fondo por defecto si no hay hover

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* HERO SECTION*/}
        <section
          className={`relative min-h-screen flex flex-col justify-center items-center text-text-light text-center nosotros-hero-before ${backgroundClasses}`}
          id="nosotros-section"
        >
          {/* Contenido*/}
          <div className="z-10 p-5 max-w-3xl">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
              Nuestra Historia
            </h1>
            <p className="text-lg mb-8 drop-shadow-lg">
              La Casa del Chantilly es la materialización de un sueño familiar,
              comenzando en 1995 con el objetivo de llevar el sabor auténtico a
              cada hogar peruano. Nuestra receta secreta, transmitida de
              generación en generación, es lo que nos distingue y nos ha
              convertido en la pastelería favorita de miles.
            </p>
          </div>

          {/* MISION / VISION CONTAINER*/}
          <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto py-12 px-5 bg-background-main w-full z-20">
            {/* Misión Box */}
            <div
              className="flex-1 p-8 rounded-xl shadow-lg border-t-4 border-primary bg-white text-text-dark transition duration-300 hover:shadow-2xl"
              onMouseEnter={() => cambiarFondo("mision")}
              onMouseLeave={restaurarFondo}
            >
              <FontAwesomeIcon
                icon={faBullseye}
                className="text-primary text-4xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-3">Misión</h2>
              <p className="text-gray-700">
                Ofrecer productos de pastelería de la más alta calidad, con
                ingredientes frescos y la receta tradicional, garantizando una
                experiencia de sabor inigualable y un servicio cálido y
                personalizado.
              </p>
            </div>

            {/* Visión Box */}
            <div
              className="flex-1 p-8 rounded-xl shadow-lg border-t-4 border-secondary bg-white text-text-dark transition duration-300 hover:shadow-2xl"
              onMouseEnter={() => cambiarFondo("vision")}
              onMouseLeave={restaurarFondo}
            >
              <FontAwesomeIcon
                icon={faEye}
                className="text-secondary text-4xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-3">Visión</h2>
              <p className="text-gray-700">
                Ser la cadena de pastelerías líder a nivel nacional, reconocida
                por nuestra excelencia, innovación constante y compromiso con la
                tradición, expandiendo nuestra presencia para endulzar cada
                rincón del país.
              </p>
            </div>
          </div>
        </section>

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20quisiera%20saber%20más%20sobre%20ustedes."
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

export default About;
