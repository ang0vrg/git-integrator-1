import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFilter,
  faDownload,
  faSearch,
  faCalendar,
  faDollarSign,
  faShoppingCart,
  faCheckCircle,
  faClock,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

interface SalesReport {
  idVenta: number;
  numeroVenta: string;
  numeroPedido: string;
  clienteNombre: string;
  clienteEmail: string;
  montoTotal: number;
  montoPagado: number;
  estadoPago: string;
  estadoPedido: string;
  estadoPedidoCodigo: string;
  estadoPedidoColor: string;
  metodoPago: string;
  referenciaTransaccion: string;
  fechaVenta: string;
  fechaPago: string;
  fechaPedido: string;
}

interface SalesStatistics {
  totalVentas: number;
  montoTotalVentas: number;
  promedioVenta: number;
  ventasPagadas: number;
  ventasPendientes: number;
  ventasParciales: number;
  ventasRechazadas: number;
  ventasReembolsadas: number;
  ventasPorMetodoPago: Record<string, number>;
  ventasPorEstadoPago: Record<string, number>;
  montosPorMetodoPago: Record<string, number>;
}

export default function SalesReportPage() {
  const [sales, setSales] = useState<SalesReport[]>([]);
  const [statistics, setStatistics] = useState<SalesStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    estadoPago: "",
    estadoPedidoCodigo: "",
    metodoPago: "",
    searchTerm: "",
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      // Fetch sales list
      const salesRes = await fetch("/api/reports/sales/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(filters),
      });

      if (salesRes.status === 403) {
        alert("No tienes permisos para ver este reporte");
        return;
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json();
        setSales(salesData);
      }

      // Fetch statistics
      const statsRes = await fetch("/api/reports/sales/statistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(filters),
      });

      if (statsRes.status === 403) {
         alert("No tienes permisos para ver las estadísticas");
         return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatistics(statsData);
      }

    } catch (error) {
      console.error("Error fetching sales data:", error);
      alert("Error al cargar los datos de ventas");
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    fetchSalesData();
  };

  const clearFilters = () => {
    setFilters({
      fechaInicio: "",
      fechaFin: "",
      estadoPago: "",
      estadoPedidoCodigo: "",
      metodoPago: "",
      searchTerm: "",
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pagado":
        return "bg-green-100 text-green-800 border-green-300";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "parcial":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "rechazado":
        return "bg-red-100 text-red-800 border-red-300";
      case "reembolsado":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pagado":
        return faCheckCircle;
      case "pendiente":
        return faClock;
      case "rechazado":
        return faTimesCircle;
      default:
        return faClock;
    }
  };

  const formatCurrency = (amount: number) => {
    return `S/ ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToExcel = async () => {
    try {
      const res = await fetch("/api/reports/sales/export/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(filters),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte_ventas_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Error al exportar Excel");
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error al exportar Excel");
    }
  };

  const exportToPdf = async () => {
    try {
      const res = await fetch("/api/reports/sales/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(filters),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte_ventas_${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Error al exportar PDF");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error al exportar PDF");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FontAwesomeIcon icon={faChartLine} />
                Reporte de Ventas
              </h1>
              <p className="text-blue-100">
                Análisis completo de ventas y estadísticas
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilter} />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Pago
                </label>
                <select
                  value={filters.estadoPago}
                  onChange={(e) => handleFilterChange("estadoPago", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="parcial">Parcial</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="reembolsado">Reembolsado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={filters.metodoPago}
                  onChange={(e) => handleFilterChange("metodoPago", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  Buscar (Cliente, Email, N° Venta)
                </label>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={() => {
                  clearFilters();
                  fetchSalesData();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Ventas</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {statistics.totalVentas}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {formatCurrency(statistics.montoTotalVentas)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faDollarSign} className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Promedio Venta</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {formatCurrency(statistics.promedioVenta)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pagadas / Pendientes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {statistics.ventasPagadas} / {statistics.ventasPendientes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-800">
                Listado de Ventas ({sales.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Excel
                </button>
                <button
                  onClick={exportToPdf}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  PDF
                </button>
              </div>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Venta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : sales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron ventas
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.idVenta} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sale.numeroVenta}
                        </div>
                        <div className="text-xs text-gray-500">{sale.numeroPedido}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sale.clienteNombre}
                        </div>
                        <div className="text-xs text-gray-500">{sale.clienteEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(sale.montoTotal)}
                        </div>
                        {sale.montoPagado > 0 && (
                          <div className="text-xs text-gray-500">
                            Pagado: {formatCurrency(sale.montoPagado)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPaymentStatusColor(
                            sale.estadoPago
                          )}`}
                        >
                          <FontAwesomeIcon
                            icon={getPaymentStatusIcon(sale.estadoPago)}
                            className="mr-1"
                          />
                          {sale.estadoPago}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border"
                          style={{
                            backgroundColor: `${sale.estadoPedidoColor}20`,
                            borderColor: sale.estadoPedidoColor,
                            color: sale.estadoPedidoColor,
                          }}
                        >
                          {sale.estadoPedido}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.metodoPago}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(sale.fechaVenta)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
