import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { IngredienteDTO } from "../types/AdminTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faWarehouse,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const CATEGORIAS = [
  "harina",
  "azucar",
  "lacteo",
  "fruta",
  "chocolate",
  "decoracion",
  "otro",
];

export default function InventoryManagement() {
  const [ingredients, setIngredients] = useState<IngredienteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [editingIngredient, setEditingIngredient] =
    useState<IngredienteDTO | null>(null);
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredienteDTO | null>(null);
  const [filterCategoria, setFilterCategoria] = useState("");
  const [formData, setFormData] = useState<IngredienteDTO>({
    nombre: "",
    descripcion: "",
    categoria: "otro",
    unidadMedida: "",
    stockActual: 0,
    stockMinimo: 0,
    stockMaximo: 0,
    puntoReorden: 0,
    costoPromedio: 0,
    ultimoCosto: 0,
    requiereRefrigeracion: false,
    diasVidaUtil: 0,
    alergeno: false,
    activo: true,
  });

  const [movementData, setMovementData] = useState({
    cantidad: 0,
    tipo: "entrada",
    motivo: "",
  });

  useEffect(() => {
    fetchIngredients();
  }, [filterCategoria]);

  const fetchIngredients = async () => {
    try {
      const url = filterCategoria
        ? `/api/admin/inventario?categoria=${filterCategoria}`
        : "/api/admin/inventario";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIngredients(data);
      }
    } catch (err) {
      console.error("Error cargando ingredientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (ingredient: IngredienteDTO) => {
    if (ingredient.stockActual === 0) {
      return { color: "bg-red-100 text-red-800", label: "Sin Stock" };
    } else if (ingredient.stockActual <= ingredient.puntoReorden) {
      return { color: "bg-yellow-100 text-yellow-800", label: "Stock Bajo" };
    } else {
      return { color: "bg-green-100 text-green-800", label: "Stock OK" };
    }
  };

  const handleOpenModal = (ingredient?: IngredienteDTO) => {
    if (ingredient) {
      setEditingIngredient(ingredient);
      setFormData(ingredient);
    } else {
      setEditingIngredient(null);
      setFormData({
        nombre: "",
        descripcion: "",
        categoria: "otro",
        unidadMedida: "",
        stockActual: 0,
        stockMinimo: 0,
        stockMaximo: 0,
        puntoReorden: 0,
        costoPromedio: 0,
        ultimoCosto: 0,
        requiereRefrigeracion: false,
        diasVidaUtil: 0,
        alergeno: false,
        activo: true,
      });
    }
    setShowModal(true);
  };

  const handleOpenMovementModal = (ingredient: IngredienteDTO) => {
    setSelectedIngredient(ingredient);
    setMovementData({ cantidad: 0, tipo: "entrada", motivo: "" });
    setShowMovementModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingIngredient
        ? `/api/ingredientes/${editingIngredient.idIngrediente}`
        : "/api/ingredientes";

      const method = editingIngredient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchIngredients();
        setShowModal(false);
      } else {
        alert("Error al guardar ingrediente");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al guardar ingrediente");
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedIngredient) return;

    try {
      const res = await fetch(
        `/api/admin/inventario/${selectedIngredient.idIngrediente}/movimiento`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(movementData),
        }
      );

      if (res.ok) {
        fetchIngredients();
        setShowMovementModal(false);
      } else {
        const error = await res.json();
        alert(error.msg || "Error al registrar movimiento");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al registrar movimiento");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseFloat(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestión de Inventario
            </h1>
            <p className="text-gray-600 mt-1">
              Control de stock de ingredientes
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo Ingrediente
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando inventario...</p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FontAwesomeIcon
              icon={faWarehouse}
              className="text-gray-300 text-6xl mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay ingredientes registrados
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando ingredientes manualmente o importando desde
              Excel
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Ingrediente
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingrediente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ingredients.map((ingredient) => {
                    const status = getStockStatus(ingredient);
                    return (
                      <tr
                        key={ingredient.idIngrediente}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ingredient.nombre}
                          </div>
                          {ingredient.codigoInterno && (
                            <div className="text-xs text-gray-500">
                              {ingredient.codigoInterno}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {ingredient.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ingredient.stockActual.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Min: {ingredient.stockMinimo.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.unidadMedida}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          S/ {ingredient.costoPromedio.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenMovementModal(ingredient)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Registrar Movimiento"
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button
                              onClick={() => handleOpenModal(ingredient)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Ingrediente */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingIngredient
                    ? "Editar Ingrediente"
                    : "Nuevo Ingrediente"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Interno
                    </label>
                    <input
                      type="text"
                      name="codigoInterno"
                      value={formData.codigoInterno || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidad de Medida *
                    </label>
                    <input
                      type="text"
                      name="unidadMedida"
                      value={formData.unidadMedida}
                      onChange={handleChange}
                      required
                      placeholder="kg, L, unidad, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Actual *
                    </label>
                    <input
                      type="number"
                      name="stockActual"
                      value={formData.stockActual}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Mínimo *
                    </label>
                    <input
                      type="number"
                      name="stockMinimo"
                      value={formData.stockMinimo}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Punto de Reorden *
                    </label>
                    <input
                      type="number"
                      name="puntoReorden"
                      value={formData.puntoReorden}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costo Promedio *
                    </label>
                    <input
                      type="number"
                      name="costoPromedio"
                      value={formData.costoPromedio}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion || ""}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="requiereRefrigeracion"
                      checked={formData.requiereRefrigeracion || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          requiereRefrigeracion: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label className="text-sm text-gray-700">
                      Requiere Refrigeración
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="alergeno"
                      checked={formData.alergeno || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          alergeno: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label className="text-sm text-gray-700">Alérgeno</label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {editingIngredient ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Movimiento */}
        {showMovementModal && selectedIngredient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="bg-purple-600 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold">Registrar Movimiento</h2>
                <p className="text-sm text-purple-100 mt-1">
                  {selectedIngredient.nombre}
                </p>
              </div>

              <form onSubmit={handleMovementSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Movimiento
                  </label>
                  <select
                    value={movementData.tipo}
                    onChange={(e) =>
                      setMovementData((prev) => ({
                        ...prev,
                        tipo: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="entrada">Entrada (Agregar Stock)</option>
                    <option value="salida">Salida (Reducir Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={movementData.cantidad}
                    onChange={(e) =>
                      setMovementData((prev) => ({
                        ...prev,
                        cantidad: parseFloat(e.target.value) || 0,
                      }))
                    }
                    required
                    step="0.01"
                    min="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Stock actual: {selectedIngredient.stockActual.toFixed(2)}{" "}
                    {selectedIngredient.unidadMedida}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo
                  </label>
                  <textarea
                    value={movementData.motivo}
                    onChange={(e) =>
                      setMovementData((prev) => ({
                        ...prev,
                        motivo: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Ej: Compra a proveedor, Uso en producción, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMovementModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
