import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { ProveedorDTO } from "../types/AdminTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCalendarAlt,
  faBoxOpen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

interface Importacion {
  idImportacion: number;
  fecha: string;
  observaciones: string;
}

interface DetalleImportacion {
  idDetalle: number;
  ingrediente: {
    nombre: string;
    unidadMedida: string;
  };
  cantidad: number;
  precioUnitario: number;
}

export default function ProviderReport() {
  const [providers, setProviders] = useState<ProveedorDTO[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [importaciones, setImportaciones] = useState<Importacion[]>([]);
  const [selectedImportacion, setSelectedImportacion] =
    useState<Importacion | null>(null);
  const [detalles, setDetalles] = useState<DetalleImportacion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchImportaciones(selectedProvider);
      setSelectedImportacion(null);
      setDetalles([]);
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (selectedImportacion) {
      fetchDetalles(selectedImportacion.idImportacion);
    }
  }, [selectedImportacion]);

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/admin/proveedores", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  const fetchImportaciones = async (idProveedor: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/reportes/importaciones?idProveedor=${idProveedor}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setImportaciones(data);
      }
    } catch (err) {
      console.error("Error fetching importaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalles = async (idImportacion: number) => {
    try {
      const res = await fetch(
        `/api/admin/reportes/importaciones/${idImportacion}/detalles`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setDetalles(data);
      }
    } catch (err) {
      console.error("Error fetching detalles:", err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reporte de Proveedores
            </h1>
            <p className="text-gray-600 mt-1">
              Historial de ingresos por proveedor
            </p>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Proveedor
          </label>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <select
                value={selectedProvider || ""}
                onChange={(e) => setSelectedProvider(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="">Seleccione un proveedor...</option>
                {providers.map((p) => (
                  <option key={p.idSupplier} value={p.idSupplier}>
                    {p.supplierName}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon
                icon={faTruck}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {selectedProvider && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Import List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-700">
                  Historial de Importaciones
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    Cargando...
                  </div>
                ) : importaciones.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No hay registros
                  </div>
                ) : (
                  importaciones.map((imp) => (
                    <button
                      key={imp.idImportacion}
                      onClick={() => setSelectedImportacion(imp)}
                      className={`w-full text-left p-4 hover:bg-green-50 transition ${
                        selectedImportacion?.idImportacion === imp.idImportacion
                          ? "bg-green-50 border-l-4 border-green-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(imp.fecha).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(imp.fecha).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {imp.observaciones && (
                        <p className="text-xs text-gray-500 mt-2 ml-11">
                          {imp.observaciones}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Details View */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">
                  Detalle de Importación
                </h3>
                {selectedImportacion && (
                  <span className="text-sm text-gray-500">
                    ID: {selectedImportacion.idImportacion}
                  </span>
                )}
              </div>

              {!selectedImportacion ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="text-4xl text-gray-300 mb-4"
                  />
                  <p>Selecciona una importación para ver los detalles</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="p-4 bg-green-50 border-b border-green-100 mb-4">
                    <p className="text-green-800 font-medium">
                      El proveedor{" "}
                      <span className="font-bold">
                        {
                          providers.find((p) => p.idSupplier === selectedProvider)
                            ?.supplierName
                        }
                      </span>{" "}
                      trajo lo siguiente:
                    </p>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ingrediente
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio Unit.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detalles.map((det) => (
                        <tr key={det.idDetalle}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {det.ingrediente.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {det.cantidad} {det.ingrediente.unidadMedida}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            S/ {det.precioUnitario?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            S/{" "}
                            {(
                              (det.cantidad || 0) * (det.precioUnitario || 0)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
