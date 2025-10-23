import React from "react";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Logo o nombre */}
        <div>
          <h2 className="text-xl font-bold text-white">Pastelería Chantilly</h2>
          <p className="text-sm mt-3 leading-relaxed">
            Tradición, sabor y excelencia en cada creación. Endulzando momentos
            desde 1998 🍰
          </p>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Enlaces rápidos
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Inicio
              </a>
            </li>
            <li>
              <a href="/productos" className="hover:text-white transition">
                Productos
              </a>
            </li>
            <li>
              <a href="/nosotros" className="hover:text-white transition">
                Nosotros
              </a>
            </li>
            <li>
              <a href="/contacto" className="hover:text-white transition">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Contáctanos
          </h3>
          <ul className="text-sm space-y-1">
            <li>Lima, Perú</li>
            <li>+51 987 654 321</li>
            <li>contacto@chantilly.pe</li>
          </ul>
        </div>

        {/* Columna 4: Redes sociales */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Síguenos
          </h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:contacto@chantilly.pe"
              className="hover:text-white transition"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-gray-800 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Pastelería Chantilly. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
