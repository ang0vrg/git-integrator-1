import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faBars,
  faTimes,
  faFileAlt, // Icono para contenido de Administrador
  faSignOutAlt, // Para el botón de Logout
  faSignInAlt, // Para el botón de Login
} from "@fortawesome/free-solid-svg-icons";

type UserRole = "cliente" | "trabajador" | "administrador";

interface MenuItem {
  path: string;
  label: string;
  minRole: UserRole;
}

const menuItems: MenuItem[] = [
  { path: "/", label: "Inicio", minRole: "cliente" },
  { path: "/productos", label: "Productos", minRole: "cliente" },
  { path: "/nosotros", label: "Nosotros", minRole: "cliente" },
  { path: "/tiendas", label: "Tiendas", minRole: "cliente" },
  { path: "/contacto", label: "Contacto", minRole: "cliente" },
  { path: "/dashboard", label: "Dashboard", minRole: "trabajador" },
  { path: "/reportes", label: "Reportes Admin", minRole: "administrador" },
];

const Menu: React.FC = () => {
  /* ----------  estados  ---------- */
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("cliente");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  /* ----------  leer token  ---------- */
  React.useEffect(() => {
    const tk = localStorage.getItem("token");
    if (!tk) return;
    try {
      const payload = JSON.parse(atob(tk.split(".")[1]));
      setEmail(payload.upn || "");
      setRole((payload.groups?.[0] as UserRole) || "cliente");
    } catch {
      setEmail("");
      setRole("cliente");
    }
  }, []);

  /* ----------  cerrar sesión  ---------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ----------  helpers  ---------- */
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.minRole === "cliente") return true;
    if (item.minRole === "trabajador")
      return role === "trabajador" || role === "administrador";
    if (item.minRole === "administrador") return role === "administrador";
    return false;
  });

  const toggleMobileMenu = () => setIsMenuOpen((v) => !v);

  return (
    // HEADER
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
        {/* LOGO */}
        <Link to="/" className="text-3xl font-extrabold text-primary">
          CH<span className="text-secondary">A</span>NTY
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="hidden md:flex space-x-6">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-text-dark hover:text-primary transition font-medium ${
                item.minRole === "administrador"
                  ? "text-primary font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ACCIONES DE USUARIO E ÍCONOS */}
        <div className="flex items-center space-x-4">
          {/* Boton de Login/Logout */}
          {/* Icono perfil + dropdown  (solo logueado) */}
          {email && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="text-2xl text-text-dark hover:text-primary transition"
                title="Mi perfil"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <p className="px-4 py-2 text-sm text-gray-600 border-b">
                    {email}
                  </p>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Editar perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
          {!email && (
            <Link
              to="/login"
              className="px-4 py-2 bg-text-dark text-white rounded-lg hover:bg-gray-700 transition text-sm font-semibold flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Link>
          )}

          {/* Btn Hamburguesa (Móvil) */}
          <button
            className="md:hidden text-2xl text-text-dark hover:text-primary transition"
            onClick={toggleMobileMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL*/}
      {isMenuOpen && (
        <nav className="absolute top-[65px] left-0 w-full bg-white shadow-lg flex flex-col items-center space-y-4 py-6 md:hidden z-30">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={toggleMobileMenu}
              className={`text-lg text-text-dark hover:text-primary transition font-medium w-full text-center p-2 ${
                item.minRole === "administrador" ? "text-primary font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Menu;
