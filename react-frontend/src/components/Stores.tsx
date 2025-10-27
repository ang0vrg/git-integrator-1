import React, { useState } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Íconos Sólidos
import {
  faMapMarkerAlt, // Para la dirección
  faClock, // Para el horario
  faPhoneAlt, // Para el teléfono
  faDirections, // Para el botón de mapa
} from "@fortawesome/free-solid-svg-icons";
// Íconos de Marcas
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import "../assets/scss/main.scss";

const StoresData = [
  {
    ciudad: "Puente Piedra",
    imagen: "img/puentepiedra.png",
    direccion: "Av. Puente Piedra 255, Puente Piedra 15118",
    horario: "Lunes a domingo: 09:00 a.m. - 20:00 p.m.",
    telefono: "(01) 456-7890",
    mapaLink: "https://maps.app.goo.gl/Ejv5hYq2R7T9bLpA7",
  },
  {
    ciudad: "Los Olivos",
    imagen: "img/losolivos.png",
    direccion: "Av. Naranjal 123, Los Olivos 15301",
    horario: "Lunes a sábado: 08:30 a.m. - 21:00 p.m.",
    telefono: "(01) 987-6543",
    mapaLink: "https://maps.app.goo.gl/LosOlivosExample",
  },
  {
    ciudad: "Comas",
    imagen: "img/comas.png",
    direccion: "Av. Universitaria 5001, Comas 15313",
    horario: "Martes a domingo: 10:00 a.m. - 19:30 p.m.",
    telefono: "(01) 111-2222",
    mapaLink: "https://maps.app.goo.gl/ComasExample",
  },
];

// Componente para una tarjeta de tienda
const StoreCard: React.FC<{ tienda: (typeof StoresData)[0] }> = ({
  tienda,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden text-left border border-gray-100 hover:shadow-2xl transition duration-300">
      <img
        src={tienda.imagen}
        alt={`Tienda de ${tienda.ciudad}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-5 space-y-3">
        <h3 className="text-2xl font-bold text-text-dark mb-2">
          {tienda.ciudad}
        </h3>
        <p className="text-gray-600 flex items-start">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-primary mr-2 mt-1 shrink-0"
          />
          {tienda.direccion}
        </p>
        <p className="text-gray-600 flex items-center">
          <FontAwesomeIcon icon={faClock} className="text-primary mr-2" />
          {tienda.horario}
        </p>
        <p className="text-gray-600 flex items-center">
          <FontAwesomeIcon icon={faPhoneAlt} className="text-primary mr-2" />
          <a
            href={`tel:${tienda.telefono}`}
            className="hover:text-primary transition"
          >
            {tienda.telefono}
          </a>
        </p>
        <a
          href={tienda.mapaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center px-4 py-3 bg-secondary text-text-dark font-semibold rounded-lg hover:bg-yellow-400 transition duration-300 mt-4 flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faDirections} /> Ver en Mapa
        </a>
      </div>
    </div>
  );
};

const Stores: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("Todas"); // Estado para filtrar

  const filteredStores =
    selectedCity === "Todas"
      ? StoresData
      : StoresData.filter((tienda) => tienda.ciudad === selectedCity);
  const uniqueCities = [
    "Todas",
    ...new Set(StoresData.map((tienda) => tienda.ciudad)),
  ];

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* TIENDAS SECTION */}
        <section className="py-10 px-5">
          <h1 className="text-4xl font-bold mb-4 text-text-dark">
            Nuestras Ubicaciones
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Encuentra la Casa del Chantilly más cercana a ti.
          </p>

          {/* Selector de Filtro */}
          <div className="mb-10 max-w-sm mx-auto">
            <label
              htmlFor="city-select"
              className="block text-text-dark font-semibold mb-2"
            >
              Filtrar por Ciudad:
            </label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            >
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* CUADRÍCULA DE TIENDAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredStores.length > 0 ? (
              filteredStores.map((tienda, index) => (
                <StoreCard key={index} tienda={tienda} />
              ))
            ) : (
              <p className="text-center col-span-full text-xl text-gray-500">
                No se encontraron tiendas en {selectedCity}.
              </p>
            )}
          </div>
        </section>

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20tengo%20una%20consulta%20sobre%20tiendas."
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


export default Stores;
