import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { ProveedorDTO } from "../types/AdminTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faFileExcel,
  faTruck,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<ProveedorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ProveedorDTO | null>(
    null
  );
  const [formData, setFormData] = useState<ProveedorDTO>({
    supplierName: "",
    businessName: "",
    ruc: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    district: "",
    city: "",
    deliveryTimeDays: 0,
    rating: 0,
    active: true,
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier?: ProveedorDTO) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({
        supplierName: "",
        businessName: "",
        ruc: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        address: "",
        district: "",
        city: "",
        deliveryTimeDays: 0,
        rating: 0,
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSupplier
        ? `/api/proveedores/${editingSupplier.idSupplier}`
        : "/api/proveedores";

      const method = editingSupplier ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchSuppliers();
        handleCloseModal();
      } else {
        alert("Error al guardar proveedor");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al guardar proveedor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      const res = await fetch(`/api/proveedores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.ok) {
        fetchSuppliers();
      }
    } catch (err) {
      console.error("Error eliminando proveedor:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
              Gestión de Proveedores
            </h1>
            <p className="text-gray-600 mt-1">
              Administra tus proveedores de ingredientes
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo Proveedor
          </button>
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando proveedores...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FontAwesomeIcon
              icon={faTruck}
              className="text-gray-300 text-6xl mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay proveedores registrados
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando tu primer proveedor
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Proveedor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier.idSupplier}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {supplier.supplierName}
                    </h3>
                    {supplier.businessName && (
                      <p className="text-sm text-gray-500">
                        {supplier.businessName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(supplier)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.idSupplier!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {supplier.ruc && (
                    <p className="text-gray-600">
                      <strong>RUC:</strong> {supplier.ruc}
                    </p>
                  )}
                  {supplier.contactName && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-gray-400"
                      />
                      <span>{supplier.contactName}</span>
                    </div>
                  )}
                  {supplier.contactPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-gray-400"
                      />
                      <span>{supplier.contactPhone}</span>
                    </div>
                  )}
                  {supplier.contactEmail && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-gray-400"
                      />
                      <span className="truncate">{supplier.contactEmail}</span>
                    </div>
                  )}
                  {supplier.city && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-gray-400"
                      />
                      <span>
                        {supplier.district}, {supplier.city}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Entrega: {supplier.deliveryTimeDays || 0} días
                  </span>
                  {supplier.rating !== undefined && supplier.rating > 0 && (
                    <span className="text-xs text-yellow-600">
                      ⭐ {supplier.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Proveedor *
                    </label>
                    <input
                      type="text"
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUC
                    </label>
                    <input
                      type="text"
                      name="ruc"
                      value={formData.ruc}
                      onChange={handleChange}
                      maxLength={11}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de Contacto
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distrito
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo de Entrega (días)
                    </label>
                    <input
                      type="number"
                      name="deliveryTimeDays"
                      value={formData.deliveryTimeDays}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calificación (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingSupplier ? "Actualizar" : "Crear"}
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
