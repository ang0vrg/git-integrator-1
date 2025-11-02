import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faPhoneAlt,
  faDirections,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import Menu from "../components/Menu";

const stores = [
  {
    ciudad: "Puente Piedra",
    imagen: "img/PuentePiedra.png",
    direccion: "Av. Puente Piedra 255, Puente Piedra 15118",
    horario: "Lunes a domingo: 09:00 a.m. - 20:00 p.m.",
    telefono: "(01) 456-7890",
    mapaLink: "https://maps.app.goo.gl/Ejv5hYq2R7T9bLpA7",
  },
  {
    ciudad: "Los Olivos",
    imagen: "img/LosOlivos.png",
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

type Store = (typeof stores)[0];

const StoreCard: React.FC<{ tienda: Store }> = ({ tienda }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300 h-full flex flex-col">
    {/* Imagen */}
    <img
      src={tienda.imagen}
      alt={`Tienda ${tienda.ciudad}`}
      className="w-full h-48 object-cover"
    />

    {/* Cuerpo */}
    <div className="p-5 space-y-3 flex-1 flex flex-col">
      <h3 className="text-2xl font-bold text-gray-800">{tienda.ciudad}</h3>

      <p className="text-gray-600 flex items-start gap-2">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="text-rose-600 mt-1 shrink-0"
        />
        {tienda.direccion}
      </p>

      <p className="text-gray-600 flex items-center gap-2">
        <FontAwesomeIcon icon={faClock} className="text-rose-600" />
        {tienda.horario}
      </p>

      <p className="text-gray-600 flex items-center gap-2">
        <FontAwesomeIcon icon={faPhoneAlt} className="text-rose-600" />
        <a href={`tel:${tienda.telefono}`} className="hover:text-rose-700">
          {tienda.telefono}
        </a>
      </p>

      {/* Botón siempre abajo */}
      <a
        href={tienda.mapaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full px-4 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faDirections} />
        Ver en Mapa
      </a>
    </div>
  </div>
);

const Stores: React.FC = () => {
  const [selected, setSelected] = useState("Todas");

  const filtered =
    selected === "Todas" ? stores : stores.filter((s) => s.ciudad === selected);

  const cities = ["Todas", ...new Set(stores.map((s) => s.ciudad))];

  return (
    <>
      <Menu />
      <main className="min-h-screen flex flex-col bg-gray-50">
        <section className="py-12 px-5">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Nuestras Ubicaciones
            </h1>
            <p className="text-gray-600 mb-8">
              Encuentra la Casa del Chantilly más cercana a ti.
            </p>

            {/* Filtro */}
            <div className="mb-10 max-w-xs">
              <label className="block text-gray-800 font-semibold mb-2">
                Filtrar por Ciudad:
              </label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-600 focus:border-rose-600"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Grilla */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.length ? (
                filtered.map((t) => <StoreCard key={t.ciudad} tienda={t} />)
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No hay tiendas en {selected}.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer único */}
      <Footer />
    </>
  );
};

export default Stores;
