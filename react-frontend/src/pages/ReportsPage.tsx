import React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Menu />
      <main className="min-h-screen bg-linear-to-br from-stone-50 to-rose-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-rose-600 mb-6">Reportes</h1>

          {/* Botones rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => navigate("/reports/users")}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Usuarios
            </button>
            <button
              onClick={() => navigate("/reports/products")}
              className="bg-yellow-400 text-rose-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Productos
            </button>
            <button
              onClick={() => navigate("/reports/sales")}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Ventas
            </button>
            <button
              onClick={() => navigate("/reports/inventory")}
              className="bg-yellow-400 text-rose-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Inventario
            </button>
            <button
              onClick={() => navigate("/reports/finance")}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Finanzas
            </button>
            <button
              onClick={() => navigate("/reports/production")}
              className="bg-yellow-400 text-rose-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Producción
            </button>
          </div>

          {/* Mensaje inicial */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-stone-200">
            <p className="text-stone-600">
              Selecciona un reporte para ver su contenido.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ReportsPage;
