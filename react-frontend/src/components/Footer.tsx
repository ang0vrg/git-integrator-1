import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface Social {
  Icon: IconType;
  url: string;
  label: string;
}

const socials: Social[] = [
  {
    Icon: FaFacebookF,
    url: "https://www.facebook.com/LaCasadelChantillyOficial",
    label: "Facebook",
  },
  {
    Icon: FaInstagram,
    url: "https://instagram.com/lacasadelchantilly",
    label: "Instagram",
  },
  {
    Icon: FaTiktok,
    url: "https://tiktok.com/@lacasadelchantilly_ofi",
    label: "TikTok",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 1 Logo */}
        <div>
          <h2 className="text-xl font-bold text-yellow-300">
            La Casa del Chantilly
          </h2>
          <p className="text-sm mt-2">Endulzando tus momentos desde 1995.</p>
        </div>

        {/* 2 Enlaces */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Enlaces rápidos
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/productos"
                className="hover:text-yellow-300 transition"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:text-yellow-300 transition">
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/tiendas" className="hover:text-yellow-300 transition">
                Tiendas
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-yellow-300 transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* 3 Contacto */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Contáctanos
          </h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-300" />
              <span>Lima, Perú</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-yellow-300" />
              <a href="tel:+51930263546" className="hover:text-yellow-300">
                +51 930 263 546
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-300" />
              <a
                href="mailto:ventas@chantilly.com"
                className="hover:text-yellow-300"
              >
                ventas@chantilly.com
              </a>
            </li>
          </ul>
        </div>

        {/* 4 Redes */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Síguenos
          </h3>
          <div className="flex gap-4">
            {socials.map(({ Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 grid place-content-center rounded-full bg-gray-700 hover:bg-rose-600 transition"
              >
                <Icon className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center text-xs text-gray-400 py-4">
        LA CASA DEL CHANTILLY S.A.C. | RUC 20552150148 ©{" "}
        {new Date().getFullYear()} Todos los derechos reservados.
      </div>
    </footer>
  );
}
