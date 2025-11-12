import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UsuarioDTO } from "../types/UsuarioDTO";
import { Layout } from "../components/Layout";

const API = "/api/public/users";

export default function UsersReport() {
  const { role } = useAuth(); // "administrador" | "trabajador" | ...
  const [users, setUsers] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // ← barra de búsqueda
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const isAdmin = role === "administrador";

  const openDeleteModal = (id: number) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    const res = await fetch(`/api/public/users/${userToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      fetchUsers();
      closeDeleteModal();
    }
  };

  const exportExcel = () => {
    const url = `/api/public/users/export/excel?q=${encodeURIComponent(
      search
    )}`;
    console.log("📥 Exportando Excel:", url);
    window.open(url, "_blank");
  };

  /* -------------------- búsqueda + lectura -------------------- */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/public/users/search?q=${encodeURIComponent(search)}`
        : "/api/public/users";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("📦 Usuarios recibidos:", data);
      setUsers(data);
    } catch (err: any) {
      console.error("❌ Error en fetchUsers:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]); // ← se ejecuta cada vez que cambia "search"

  /* -------------------- render -------------------- */

  return (
    <Layout>
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-rose-700 mb-4">
          Reporte de usuarios
        </h1>

        {/* Barra de búsqueda (sin dropdown) */}
        <input
          type="text"
          placeholder="Buscar por nombre, email o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={fetchUsers} // o onKeyUp para búsqueda en tiempo real
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />

        {/* Tabla con estilo Tailwind */}
        {users.length === 0 ? (
          <p className="text-gray-500">No hay usuarios para este filtro.</p>
        ) : (
          <div className="overflow-x-auto">
            {isAdmin && (
              <button
                onClick={exportExcel}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Exportar Excel
              </button>
            )}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {u.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {u.username}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {u.userEmail}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="badge">{u.userRole}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="p-2 text-center">
                        <button
                          onClick={() => openDeleteModal(u.id!)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¿Eliminar usuario?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
