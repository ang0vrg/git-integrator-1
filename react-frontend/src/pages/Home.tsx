// react-frontend\src\pages\Home.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

    // Limpiar el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  //MANEJADORES DEL POP-UP
  const closePromo = () => {
    setIsPromoOpen(false);
  };

  const handlePromoClick = (promoName: string) => {
    console.log(`Promoción seleccionada: ${promoName}`);
    // Lógica para redirigir o aplicar cupón
    alert(`¡Has seleccionado la promoción ${promoName}!`);
    closePromo();
  };

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* HERO- Clases de layout y responsive */}
        <section className="relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden">
          {/* Contenido del Video de Fondo */}
          <div className="absolute inset-0">
            <div className="w-full h-full">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-food-truck-42171-large.mp4"
                  type="video/mp4"
                />
                Tu navegador no soporta la etiqueta de video.
              </video>
              <div className="absolute inset-0 bg-black/40 z-10"></div>
            </div>
          </div>

          {/* Texto del Hero Banner*/}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-5 text-center text-text-light">
            <div className="space-y-6 animate-slide-in max-w-lg">
              <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
                El Sabor Que Enamora<span className="text-primary">.</span>
              </h1>
              <Link
                to="/productos"
                className="inline-block mt-4 px-8 py-3 bg-primary text-text-light font-bold rounded-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:scale-105"
              >
                Ver Productos
              </Link>
            </div>
          </div>
        </section>

        {/*Clases para layout de carrusel y tarjetas */}
        <section className="py-12 bg-background-main">
          <h2 className="text-3xl font-bold mb-8 text-text-dark">
            Nuestros Productos Destacados
          </h2>

          {/* Contenedor del Carrusel*/}
          <div className="overflow-x-scroll scrollbar-hide p-4">
            <div className="flex space-x-6 min-w-max justify-center">
              {/*Se aplica 'card-chanty-pop' para el pseudo-elemento */}
              <div
                className="card-chanty-pop relative bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer w-72 shrink-0"
                onClick={() => console.log("Ir a Torta Clásica")}
              >
                <img
                  src="img/tortaClasica.png"
                  alt="Torta Clásica"
                  className="rounded-t-lg w-full h-40 object-cover"
                />
                <h3 className="text-xl font-semibold mt-3 text-text-dark">
                  Torta Clásica
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  El sabor original que nos hizo famosos.
                </p>
                <Link
                  to="/productos"
                  className="inline-block mt-auto px-4 py-2 bg-secondary text-text-dark font-semibold rounded-md hover:bg-yellow-400 transition duration-300 text-sm"
                >
                  Ver más
                </Link>
              </div>

              <div
                className="card-chanty-pop relative bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer w-72 shrink-0"
                onClick={() => console.log("Ir a Bocaditos")}
              >
                <img
                  src="img/Bocaditos.jpg"
                  alt="Bocaditos"
                  className="rounded-t-lg w-full h-40 object-cover"
                />
                <h3 className="text-xl font-semibold mt-3 text-text-dark">
                  Bocaditos Premium
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Variedad para tus eventos especiales.
                </p>
                <Link
                  to="/productos"
                  className="inline-block mt-auto px-4 py-2 bg-secondary text-text-dark font-semibold rounded-md hover:bg-yellow-400 transition duration-300 text-sm"
                >
                  Ver más
                </Link>
              </div>

              <div
                className="card-chanty-pop relative bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer w-72 shrink-0"
                onClick={() => console.log("Ir a Postres")}
              >
                <img
                  src="img/Postres.jpg"
                  alt="Postres"
                  className="rounded-t-lg w-full h-40 object-cover"
                />
                <h3 className="text-xl font-semibold mt-3 text-text-dark">
                  Postres Individuales
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Un antojo dulce para cualquier momento.
                </p>
                <Link
                  to="/productos"
                  className="inline-block mt-auto px-4 py-2 bg-secondary text-text-dark font-semibold rounded-md hover:bg-yellow-400 transition duration-300 text-sm"
                >
                  Ver más
                </Link>
              </div>

              <div
                className="card-chanty-pop relative bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer w-72 shrink-0"
                onClick={() => console.log("Ir a Torta Personalizada")}
              >
                <img
                  src="img/TortaPersonalizada.png"
                  alt="Torta Personalizada"
                  className="rounded-t-lg w-full h-40 object-cover"
                />
                <h3 className="text-xl font-semibold mt-3 text-text-dark">
                  Torta Personalizada
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tu diseño, nuestro sabor.
                </p>
                <Link
                  to="/productos"
                  className="inline-block mt-auto px-4 py-2 bg-secondary text-text-dark font-semibold rounded-md hover:bg-yellow-400 transition duration-300 text-sm"
                >
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN SOBRE NOSOTROS */}
        <section className="bg-white">
          <h2 className="text-3xl font-bold mb-4 text-text-dark">
            Sobre Nosotros
          </h2>
          <p className="max-w-3xl mx-auto mb-6 text-lg text-text-dark">
            Desde 1995, La Casa del Chantilly ha sido la tradición de las mesas
            peruanas, ofreciendo los más deliciosos postres y tortas con la
            receta secreta de la familia.
          </p>
          <Link
            to="/nosotros"
            className="inline-block px-6 py-3 bg-text-dark text-text-light font-bold rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Conoce Nuestra Historia
          </Link>
        </section>

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20quisiera%20hacer%20un%20pedido."
          className="fixed bottom-6 right-6 p-4 rounded-full bg-whatsapp text-white shadow-xl hover:bg-green-600 transition duration-300 z-50 text-3xl flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          title="Chatea con nosotros por WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>

        {/* POP-UP PROMOCIONAL */}
        <div
          id="promo-popup"
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
          style={{ display: isPromoOpen ? "block" : "none" }}
        >
          <div className="relative bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-lg w-full text-center animate-fade-in">
            {/* Botón de Cierre */}
            <span
              className="absolute top-2 right-4 text-4xl font-light text-gray-500 cursor-pointer hover:text-text-dark transition"
              onClick={closePromo}
            >
              &times;
            </span>

            <h2 className="text-3xl font-bold text-primary mb-4">
              ¡Promociones Exclusivas!
            </h2>
            <p className="text-lg text-text-dark mb-6">
              Aprovecha nuestros descuentos de temporada y celebra con sabor.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {/* Tarjeta Promo 1 */}
              <div
                className="flex-basis-promo-33-minus-20 min-w-120 bg-background-main p-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => handlePromoClick("Chanty Fiesta")}
              >
                <img
                  src="img/chantyFiestaPromo.jpg"
                  alt="Chanty Fiesta"
                  className="rounded-md"
                />
                <h4 className="font-bold mt-2 text-text-dark">Chanty Fiesta</h4>
                <p className="text-sm">1 Torta + 12 Bocaditos</p>
              </div>

              {/* Tarjeta Promo 2 */}
              <div
                className="flex-basis-promo-33-minus-20 min-w-120 bg-background-main p-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => handlePromoClick("Familiar")}
              >
                <img
                  src="img/promoFamiliar.jpg"
                  alt="Familiar"
                  className="rounded-md"
                />
                <h4 className="font-bold mt-2 text-text-dark">Pack Familiar</h4>
                <p className="text-sm">2 Postres + 6 Galletas</p>
              </div>

              {/* Tarjeta Promo 3 */}
              <div
                className="flex-basis-promo-33-minus-20 min-w-120 bg-background-main p-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => handlePromoClick("Cupón 10% Off")}
              >
                <img
                  src="img/promo10Off.jpg"
                  alt="Cupón 10% Off"
                  className="rounded-md"
                />
                <h4 className="font-bold mt-2 text-text-dark">
                  10% de Descuento
                </h4>
                <p className="text-sm">En tu primera compra online.</p>
              </div>
            </div>
            <button
              onClick={closePromo}
              className="inline-block px-8 py-3 bg-secondary text-text-dark font-bold rounded-lg shadow-xl hover:bg-yellow-400 transition duration-300"
            >
              ¡Lo quiero!
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER*/}
      <footer className="bg-text-dark text-text-light py-10">
        <div className="flex flex-wrap justify-around max-w-7xl mx-auto px-5 gap-8">
          {/* Columna Logo */}
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              La Casa del Chantilly
            </h3>
            <p className="mb-2 text-sm">Endulzando tus momentos desde 1995.</p>
          </div>

          {/* Columna Navegación */}
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

          {/* Columna Contacto */}
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

          {/* Columna Redes Sociales */}
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

        {/* Footer Bottom */}
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

export default Home;
