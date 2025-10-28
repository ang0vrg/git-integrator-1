import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faBars,
  faTimes,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

type UserRole = "cliente" | "trabajador" | "administrador";

interface MenuItem {
  path: string;
  label: string;
  minRole: UserRole;
}

const menuItems: MenuItem[] = [
  { path: "/home", label: "Inicio", minRole: "cliente" },
  { path: "/products", label: "Productos", minRole: "cliente" },
  { path: "/about", label: "Nosotros", minRole: "cliente" },
  { path: "/stores", label: "Tiendas", minRole: "cliente" },
  { path: "/contact", label: "Contacto", minRole: "cliente" },
  { path: "/dashboard", label: "Dashboard", minRole: "trabajador" },
  { path: "/reports", label: "Reportes Admin", minRole: "administrador" },
];

const Menu: React.FC = () => {
  /* ----------  estados  ---------- */
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("cliente");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  /* ----------  leer token  ---------- */
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    const tk = localStorage.getItem("token");
    if (!tk) return;
    try {
      const payload = JSON.parse(atob(tk.split(".")[1]));
      setEmail(payload.upn || "");
      setRole((payload.groups?.[0] as UserRole) || "cliente");
      setFullName(payload.name || payload.upn?.split("@")[0] || "");
    } catch {
      setEmail("");
      setRole("cliente");
      setFullName("");
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

  /* cerrar dropdown al clicar fuera */
  useEffect(() => {
    const close = () => setDropdownOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-rose-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + marca */}
          <Link to="/home" className="flex items-center space-x-3">
            <img
              src="/logoV2.svg"
              alt="La Casa del Chantilly"
              className="h-10"
            />
            <span className="text-xl font-bold text-yellow-100 tracking-tight">
              La Casa del <span className="text-yellow-300">Chantilly</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition
                          ${
                            item.minRole === "administrador"
                              ? "text-yellow-300 hover:bg-rose-700"
                              : "text-white hover:text-yellow-200 hover:bg-rose-700"
                          }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Perfil dropdown */}
            {email && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg
                           bg-yellow-400 text-rose-900 hover:bg-yellow-300
                           transition duration-200"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="hidden sm:inline text-sm">
                    {fullName || email.split("@")[0]}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl
                            border border-gray-200 overflow-hidden
                            transition-all duration-200 ease-out
                            ${
                              dropdownOpen
                                ? "opacity-100 scale-100 translate-y-0"
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}
                >
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                    {email}
                  </div>
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-3 text-sm text-gray-700
                             hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-3 text-gray-400"
                    />
                    Editar perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-rose-600
                             hover:bg-rose-50 transition"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            {/* Login button (no logueado) */}
            {!email && (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg
                         bg-yellow-400 text-rose-900 text-sm font-medium
                         hover:bg-yellow-300 transition duration-200"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-2xl text-yellow-200 hover:text-white
                       transition duration-200"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
        >
          <nav className="flex flex-col items-center space-y-3 py-4 bg-rose-700">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full text-center px-4 py-2 rounded-md text-base font-medium
                          ${
                            item.minRole === "administrador"
                              ? "text-yellow-300 hover:bg-rose-800"
                              : "text-white hover:text-yellow-200 hover:bg-rose-800"
                          }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Menu;
