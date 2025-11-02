import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye, // Icono para Misión
    faEye // Icono para Visión
} from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
// =======================================

import "../App.css";
import Menu from '../components/Menu';

const bgImgs = {
  mision: "url(/img/mision-bg.jpg)",
  vision: "url(/img/vision-bg.jpg)",
  default: "url(/img/nosotros-hero-default.jpg)",
};

const About: React.FC = () => {
  const [bg, setBg] = useState<keyof typeof bgImgs>("default");

  return (
    <>
      <Menu />
      <main className="min-h-screen flex flex-col">
        {/* HERO */}
        <section
          style={{ backgroundImage: bgImgs[bg] }}
          className="relative min-h-screen flex flex-col justify-center items-center text-center text-white bg-cover bg-center"
        >
          {/* overlay oscuro */}
          <div className="absolute inset-0">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="https://www.shutterstock.com/shutterstock/videos/1105946585/preview/stock-footage-portrait-of-happy-diverse-bakers-working-in-bakery-kitchen-holding-fresh-bread-in-slow-motion.webm"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>
          <div className="relative z-10 px-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl mb-4">
              Nuestra Historia
            </h1>
            <p className="text-lg md:text-xl drop-shadow-lg">
              La Casa del Chantilly es la materialización de un sueño familiar,
              comenzando en 1995 con el objetivo de llevar el sabor auténtico a
              cada hogar peruano. Nuestra receta secreta, transmitida de
              generación en generación, es lo que nos distingue.
            </p>
          </div>

          {/* Misión / Visión */}
          <div className="relative z-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12 px-4">
            {/* Misión */}
            <div
              className="p-8 rounded-xl shadow-lg bg-white text-gray-800 border-t-4 border-rose-600 hover:shadow-2xl transition"
              onMouseEnter={() => setBg("mision")}
              onMouseLeave={() => setBg("default")}
              onClick={() => setBg(bg === "mision" ? "default" : "mision")}
            >
              <FontAwesomeIcon
                icon={faBullseye}
                className="text-rose-600 text-4xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-3">Misión</h2>
              <p className="text-gray-700">
                Ofrecer productos de pastelería de la más alta calidad, con
                ingredientes frescos y la receta tradicional, garantizando una
                experiencia de sabor inigualable y un servicio cálido y
                personalizado.
              </p>
            </div>

            {/* Visión */}
            <div
              className="p-8 rounded-xl shadow-lg bg-white text-gray-800 border-t-4 border-yellow-400 hover:shadow-2xl transition"
              onMouseEnter={() => setBg("vision")}
              onMouseLeave={() => setBg("default")}
              onClick={() => setBg(bg === "vision" ? "default" : "vision")}
            >
              <FontAwesomeIcon
                icon={faEye}
                className="text-yellow-400 text-4xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-3">Visión</h2>
              <p className="text-gray-700">
                Ser la cadena de pastelerías líder a nivel nacional, reconocida
                por nuestra excelencia, innovación constante y compromiso con la
                tradición.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer unificado */}
      <Footer />
    </>
  );
};

export default About;