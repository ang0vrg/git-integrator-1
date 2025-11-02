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

import "../App.css";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

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

  // Productos traídos desde el backend
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products from backend proxy (/api)
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) {
          console.warn('Could not load products', res.status);
          return;
        }
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
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
        <Menu />

        {/* ------------------------------------------------ HERO */}
        <section className="relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video fondo */}
          <div className="absolute inset-0">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="https://media.istockphoto.com/id/1048817772/es/v%C3%ADdeo/corte-chocolate-torta-cerca-para-arriba.mp4?s=mp4-640x640-is&k=20&c=4Kt2s6O-iKsk63FuFciwRTLszJwbFZHzgN2pcEwNH28="
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>

          {/* Texto */}
          <div className="relative z-20 text-center text-white px-5">
            <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl">
              El Sabor Que Enamora
              <span className="text-yellow-300">.</span>
            </h1>
            <Link
              to="/productos"
              className="inline-block mt-6 px-8 py-3 bg-yellow-400 text-rose-900 font-bold rounded-lg shadow-xl hover:bg-yellow-300 transition transform hover:scale-105"
            >
              Ver Productos
            </Link>
          </div>
        </section>

        {/* ------------------------------------------------ PRODUCTOS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Nuestros Productos Destacados
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {products && products.length > 0 ? (
                products.map((p) => (
                  <div
                    key={p.idProduct ?? p.id ?? p.productName}
                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition w-72 shrink-0 flex flex-col"
                  >
                    <img
                      src={
                        p.productImageId
                          ? `/api/imagenes/${p.productImageId}`
                          : 'img/tortaClasica.png'
                      }
                      alt={p.productName}
                      className="rounded-t-xl h-48 object-cover"
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {p.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 mb-2">{p.productDescription}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-rose-700 font-bold">S/ {p.productPrice?.toFixed ? p.productPrice.toFixed(2) : p.productPrice}</div>
                        <div className="text-sm text-gray-600">Stock: {p.productQuantity ?? 0}</div>
                      </div>
                      <Link
                        to="/productos"
                        className="mt-3 inline-block px-4 py-2 bg-yellow-400 text-rose-900 font-semibold rounded-md hover:bg-yellow-300 transition"
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-600">No hay productos disponibles.</div>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ NOSOTROS */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Sobre Nosotros
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Desde 1995, La Casa del Chantilly ha sido la tradición de las
              mesas peruanas, ofreciendo los más deliciosos postres y tortas con
              la receta secreta de la familia.
            </p>
            <Link
              to="/nosotros"
              className="inline-block px-6 py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition"
            >
              Conoce Nuestra Historia
            </Link>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------ WHATSAPP */}
      <a
        href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly%2C%20quisiera%20hacer%20un%20pedido."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-4 rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition z-50 text-3xl"
        title="Chatea con nosotros"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>

      {/* ------------------------------------------------ POP-UP */}
      {isPromoOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-10 text-center">
            <button
              className="absolute top-2 right-4 text-3xl text-gray-400 hover:text-gray-800"
              onClick={closePromo}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-rose-600 mb-4">
              ¡Promociones Exclusivas!
            </h2>
            <p className="text-gray-700 mb-6">
              Aprovecha nuestros descuentos de temporada y celebra con sabor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  img: "img/chantyFiestaPromo.jpg",
                  title: "Chanty Fiesta",
                  desc: "1 Torta + 12 Bocaditos",
                  key: "Chanty Fiesta",
                },
                {
                  img: "img/promoFamiliar.jpg",
                  title: "Pack Familiar",
                  desc: "2 Postres + 6 Galletas",
                  key: "Familiar",
                },
                {
                  img: "img/promo10Off.jpg",
                  title: "10% de Descuento",
                  desc: "En tu primera compra online.",
                  key: "Cupón 10% Off",
                },
              ].map((card) => (
                <div
                  key={card.key}
                  onClick={() => handlePromoClick(card.key)}
                  className="bg-gray-50 rounded-lg shadow hover:shadow-xl transition cursor-pointer p-3"
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="rounded-md mb-2"
                  />
                  <h4 className="font-bold text-gray-800">{card.title}</h4>
                  <p className="text-xs text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={closePromo}
              className="px-8 py-3 bg-yellow-400 text-rose-900 font-bold rounded-lg shadow-xl hover:bg-yellow-300 transition"
            >
              ¡Lo quiero!
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ FOOTER */}
      <Footer />
    </>
  );
};

export default Home;
