import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faTruck,
  faChartLine,
  faUsers,
  faExclamationTriangle,
  faFileExcel,
  faWarehouse,
  faDollarSign,
  faUserPlus,
  faClock,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

interface InventoryStats {
  totalIngredientes: number;
  bajoStock: number;
  sinStock: number;
  valorTotal: number;
}

interface UserStats {
  totalUsers: number;
  lastUser: string;
  lastUserDate: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [invRes, userRes] = await Promise.all([
        fetch("/api/admin/inventario/estadisticas", { headers }),
        fetch("/api/admin/users/stats", { headers }),
      ]);

      if (invRes.ok) {
        const data = await invRes.json();
        setStats(data);
      }

      if (userRes.ok) {
        const data = await userRes.json();
        setUserStats(data);
      }
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickAccessCards = [
    {
      title: "Gestión de Proveedores",
      description: "Administrar proveedores y sus datos de contacto",
      icon: faTruck,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      path: "/admin/suppliers",
    },
    {
      title: "Inventario de Ingredientes",
      description: "Ver stock, registrar movimientos y alertas",
      icon: faWarehouse,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      path: "/admin/inventory",
    },
    {
      title: "Importar Ingredientes",
      description: "Cargar ingredientes desde Excel",
      icon: faFileExcel,
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
      path: "/admin/import",
    },
    {
      title: "Reportes de Usuarios",
      description: "Ver y exportar reportes de usuarios",
      icon: faUsers,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      path: "/admin/reports/users",
    },
    {
      title: "Crear Receta",
      description: "Crear nuevas recetas y asignarlas al catálogo",
      icon: faUtensils,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      path: "/admin/recipes/create",
    },
    {
      title: "Lista de Recetas",
      description: "Ver todas las recetas y crear productos",
      icon: faUtensils,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      path: "/admin/recipes",
    },
    {
      title: "Reporte de Ventas",
      description: "Ver reporte detallado de ventas y estadísticas",
      icon: faChartLine,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      path: "/admin/reports/sales",
    },

  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-rose-100">
            Panel de control y métricas del sistema
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Ingredientes */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Ingredientes
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "..." : stats?.totalIngredientes || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <FontAwesomeIcon
                  icon={faBoxes}
                  className="text-blue-500 text-2xl"
                />
              </div>
            </div>
          </div>

          {/* Stock Bajo */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Stock Bajo</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "..." : stats?.bajoStock || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-yellow-500 text-2xl"
                />
              </div>
            </div>
          </div>

          {/* Total Usuarios */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Usuarios
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "..." : userStats?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-purple-500 text-2xl"
                />
              </div>
            </div>
          </div>

          {/* Último Usuario */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Último Usuario
                </p>
                <p className="text-xl font-bold text-gray-800 mt-2 truncate max-w-[120px]" title={userStats?.lastUser || ""}>
                  {loading ? "..." : userStats?.lastUser || "N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {loading ? "" : userStats?.lastUserDate ? new Date(userStats.lastUserDate).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="bg-pink-100 p-4 rounded-full">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="text-pink-500 text-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Acceso Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessCards.map((card, index) => (
              <button
                key={index}
                onClick={() => navigate(card.path)}
                className={`${card.color} ${card.hoverColor} text-white rounded-xl p-6 shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl text-left`}
              >
                <div className="flex items-center justify-between mb-4">
                  <FontAwesomeIcon icon={card.icon} className="text-4xl" />
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder for Power BI / Charts */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Métricas y Análisis
            </h2>
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-gray-400 text-2xl"
            />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-gray-300 text-6xl mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Integración con Power BI
            </h3>
            <p className="text-gray-500">
              Aquí se integrarán los dashboards y reportes de Power BI
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Puedes embeber iframes de Power BI o usar la API de Power BI
              Embedded
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        {stats && stats.bajoStock > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex items-start">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-yellow-400 text-2xl mr-4 mt-1"
              />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                  Alerta de Stock Bajo
                </h3>
                <p className="text-yellow-700">
                  Hay <strong>{stats.bajoStock}</strong> ingrediente(s) con
                  stock bajo. Considera realizar un pedido.
                </p>
                <button
                  onClick={() => navigate("/admin/inventory")}
                  className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Ver Inventario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
