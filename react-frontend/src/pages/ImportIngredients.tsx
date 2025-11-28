import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { ProveedorDTO, ImportResultDTO } from "../types/AdminTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faUpload,
  faCheckCircle,
  faExclamationTriangle,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function ImportIngredients() {
  const [suppliers, setSuppliers] = useState<ProveedorDTO[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResultDTO | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/proveedores", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (err) {
      console.error("Error cargando proveedores:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedSupplier) {
      alert("Por favor selecciona un proveedor y un archivo");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("idProveedor", selectedSupplier.toString());

      const res = await fetch("/api/admin/ingredientes/import/excel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      if (data.exitoso) {
        // Limpiar formulario después de éxito
        setFile(null);
        setSelectedSupplier(null);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (err) {
      console.error("Error importando:", err);
      alert("Error al importar archivo");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    import("xlsx").then((XLSX) => {
      const headers = [
        {
          Código: "ING001",
          Nombre: "Harina 000",
          Unidad: "kg",
          Categoría: "harina",
          "Costo Unitario": 2.50,
          "Precio Minorista": 3.50,
          "Precio Mayorista": 3.20,
          "Precio Distribuidor": 3.00,
          "Stock Inicial": 100,
          "Stock Mínimo": 10,
          "Stock Máximo": 500,
          "Punto Reorden": 20,
          "Refrigeración": "No",
          "Vida Útil (días)": 180,
          "Alergeno": "Si"
        },
        {
          Código: "ING002",
          Nombre: "Azúcar Blanca",
          Unidad: "kg",
          Categoría: "azucar",
          "Costo Unitario": 2.00,
          "Precio Minorista": 2.80,
          "Precio Mayorista": 2.50,
          "Precio Distribuidor": 2.30,
          "Stock Inicial": 50,
          "Stock Mínimo": 5,
          "Stock Máximo": 200,
          "Punto Reorden": 10,
          "Refrigeración": "No",
          "Vida Útil (días)": 365,
          "Alergeno": "No"
        },
        {
          Código: "ING003",
          Nombre: "Mantequilla",
          Unidad: "kg",
          Categoría: "lacteo",
          "Costo Unitario": 10.00,
          "Precio Minorista": 12.00,
          "Precio Mayorista": 11.50,
          "Precio Distribuidor": 11.00,
          "Stock Inicial": 25,
          "Stock Mínimo": 5,
          "Stock Máximo": 50,
          "Punto Reorden": 8,
          "Refrigeración": "Si",
          "Vida Útil (días)": 30,
          "Alergeno": "Si"
        }
      ];

      const ws = XLSX.utils.json_to_sheet(headers, {
        header: [
          "Código",
          "Nombre",
          "Unidad",
          "Categoría",
          "Costo Unitario",
          "Precio Minorista",
          "Precio Mayorista",
          "Precio Distribuidor",
          "Stock Inicial",
          "Stock Mínimo",
          "Stock Máximo",
          "Punto Reorden",
          "Refrigeración",
          "Vida Útil (días)",
          "Alergeno"
        ],
        skipHeader: false
      });
      
      // Ajustar ancho de columnas
      const wscols = [
        { wch: 10 }, // Código
        { wch: 20 }, // Nombre
        { wch: 10 }, // Unidad
        { wch: 12 }, // Categoría
        { wch: 15 }, // Costo Unitario
        { wch: 15 }, // Precio Minorista
        { wch: 15 }, // Precio Mayorista
        { wch: 18 }, // Precio Distribuidor
        { wch: 12 }, // Stock Inicial
        { wch: 12 }, // Stock Mínimo
        { wch: 12 }, // Stock Máximo
        { wch: 12 }, // Punto Reorden
        { wch: 12 }, // Refrigeración
        { wch: 12 }, // Vida Útil
        { wch: 10 }, // Alergeno
      ];
      ws["!cols"] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
      XLSX.writeFile(wb, "plantilla_ingredientes.xlsx");
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Importar Ingredientes</h1>
          <p className="text-emerald-100">
            Carga masiva de ingredientes desde Excel
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📋 Instrucciones
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Descarga la plantilla de ejemplo</li>
            <li>Completa los datos de tus ingredientes</li>
            <li>Selecciona el proveedor</li>
            <li>Sube el archivo Excel (.xlsx o .csv)</li>
          </ol>
          <button
            onClick={downloadTemplate}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faDownload} />
            Descargar Plantilla
          </button>
        </div>

        {/* Format Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Formato del Archivo
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Columna
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Obligatorio
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">
                    Ejemplo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Código</td>
                  <td className="px-4 py-2">Texto</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">ING001</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Nombre</td>
                  <td className="px-4 py-2">Texto</td>
                  <td className="px-4 py-2">
                    <span className="text-red-600 font-semibold">Sí</span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">Harina 000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Unidad</td>
                  <td className="px-4 py-2">Texto</td>
                  <td className="px-4 py-2">
                    <span className="text-red-600 font-semibold">Sí</span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">kg</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Categoría</td>
                  <td className="px-4 py-2">Texto</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">harina</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Costo Unitario</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">2.50</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Precio Minorista</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">3.50</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Precio Mayorista</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">3.20</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Precio Distribuidor</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">3.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Stock Inicial</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">100</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Stock Mínimo</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">10</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Stock Máximo</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">500</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Punto Reorden</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">20</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Refrigeración</td>
                  <td className="px-4 py-2">Si/No</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Vida Útil (días)</td>
                  <td className="px-4 py-2">Número</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">30</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Alergeno</td>
                  <td className="px-4 py-2">Si/No</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2 text-gray-600">Si</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Subir Archivo
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor *
              </label>
              <select
                value={selectedSupplier || ""}
                onChange={(e) => setSelectedSupplier(Number(e.target.value))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecciona un proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.idSupplier} value={supplier.idSupplier}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo Excel *
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      className="text-4xl text-emerald-500 mb-2"
                    />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click para subir</span> o
                      arrastra el archivo
                    </p>
                    <p className="text-xs text-gray-500">
                      Excel (.xlsx) o CSV (.csv)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Archivo seleccionado: <strong>{file.name}</strong>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading || !file || !selectedSupplier}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Importando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} />
                  Importar Ingredientes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div
            className={`rounded-xl shadow-md p-6 ${
              result.exitoso
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-red-50 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <FontAwesomeIcon
                icon={result.exitoso ? faCheckCircle : faExclamationTriangle}
                className={`text-3xl ${
                  result.exitoso ? "text-green-500" : "text-red-500"
                }`}
              />
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    result.exitoso ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.exitoso
                    ? "✅ Importación Exitosa"
                    : "❌ Importación con Errores"}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Filas</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {result.totalFilas}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Creados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.ingredientesCreados}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Actualizados</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.ingredientesActualizados}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Errores</p>
                    <p className="text-2xl font-bold text-red-600">
                      {result.errores}
                    </p>
                  </div>
                </div>

                {result.mensajesError && result.mensajesError.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Mensajes de Error:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                      {result.mensajesError.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
