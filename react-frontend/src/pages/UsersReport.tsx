  // src/pages/UsersReport.tsx
  import React, { useEffect, useState } from "react";
  import Menu from "../components/Menu";
  import Footer from "../components/Footer";

  interface User {
    id: number;
    username: string;
    userEmail: string;
    userRole: string;
    phoneNumber: string;
    createdAt: string;
  }

  const UsersReport: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token");

    // 🔹 Cargar lista de usuarios
    useEffect(() => {
      console.log("TOKEN ENVIADO:", token);
      if (!token) {
        setError("No hay token activo. Inicia sesión como administrador.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      fetch(`http://localhost:8080/api/admin/users?role=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok)
            throw new Error(`Error ${res.status}: ${await res.text()}`);
          return res.json();
        })
        .then((data) => setUsers(data))
        .catch((err) => {
          console.error(err);
          setError("No se pudo cargar la lista de usuarios.");
        })
        .finally(() => setLoading(false));
    }, [filter]);

    // 🔹 Filtrado por búsqueda
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.userEmail.toLowerCase().includes(search.toLowerCase())
    );

    // 🔹 Eliminar usuario
    const handleDelete = (id: number) => {
      if (!confirm("¿Eliminar este usuario?")) return;

      fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar usuario.");
          setUsers((prev) => prev.filter((u) => u.id !== id));
        })
        .catch((err) => {
          console.error(err);
          alert("No se pudo eliminar el usuario.");
        });
    };

    // 🔹 Exportar Excel
    const handleExportExcel = () => {
      window.open(
        `http://localhost:8080/api/admin/users/export/excel?role=${filter}`,
        "_blank"
      );
    };

    // ---------------- UI -----------------
    return (
      <>
        <Menu />
        <main className="min-h-screen bg-linear-to-br from-stone-50 to-rose-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-rose-600 mb-4">
                Reporte de Usuarios
              </h2>

              {/* --- Filtros --- */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-stone-300 rounded-lg"
                >
                  <option value="">Todos los roles</option>
                  <option value="cliente">Cliente</option>
                  <option value="trabajador">Trabajador</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              {/* --- Estado de carga / error --- */}
              {loading ? (
                <p className="text-stone-500 text-center py-6">
                  Cargando usuarios...
                </p>
              ) : error ? (
                <p className="text-rose-600 text-center py-6">{error}</p>
              ) : filtered.length === 0 ? (
                <p className="text-stone-600 text-center py-6">
                  No hay usuarios que coincidan con los filtros.
                </p>
              ) : (
                <>
                  {/* --- Tabla --- */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="border-b border-stone-300 bg-stone-100">
                        <tr>
                          <th className="pb-2 px-2 text-stone-700">Nombre</th>
                          <th className="pb-2 px-2 text-stone-700">Correo</th>
                          <th className="pb-2 px-2 text-stone-700">Rol</th>
                          <th className="pb-2 px-2 text-stone-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((u) => (
                          <tr
                            key={u.id}
                            className="border-b border-stone-200 hover:bg-stone-50"
                          >
                            <td className="py-2 px-2">{u.username}</td>
                            <td className="py-2 px-2">{u.userEmail}</td>
                            <td className="py-2 px-2 capitalize">{u.userRole}</td>
                            <td className="py-2 px-2 space-x-2">
                              <button className="text-sm bg-yellow-400 text-rose-900 px-2 py-1 rounded hover:bg-yellow-300">
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="text-sm bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* --- Exportar --- */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleExportExcel}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Exportar a Excel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  };

  export default UsersReport;
