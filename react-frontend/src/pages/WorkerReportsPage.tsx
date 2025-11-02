import React from "react";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

const WorkerReportsPage: React.FC = () => {
  return (
    <>
      <Menu />
      <main className="min-h-screen bg-linear-to-br from-stone-50 to-rose-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-rose-600 mb-6">
            Reportes Trabajador
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/worker/reports/users"
              className="bg-yellow-400 text-rose-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Usuarios
            </Link>
            <Link
              to="/worker/reports/users/export/excel"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              target="_blank"
            >
              Exportar Excel
            </Link>
          </div>

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

export default WorkerReportsPage;
