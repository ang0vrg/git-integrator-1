import React, { useState } from "react";
import { Link } from "react-router-dom";
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

//roles
type UserRole = "cliente" | "usuario" | "administrador";

interface MenuItem {
  path: string;
  label: string;
  minRole: UserRole;
}

const menuItems: MenuItem[] = [
  { path: "/", label: "Inicio", minRole: "cliente" },
  { path: "/products", label: "Productos", minRole: "cliente" },
  { path: "/about", label: "Nosotros", minRole: "cliente" },
  { path: "/stores", label: "Tiendas", minRole: "cliente" },
  { path: "/contact", label: "Contacto", minRole: "cliente" },

  // Enlace del rol usuario
  { path: "/dashboard", label: "Dashboard Usuario", minRole: "usuario" },

  // Enlace del rol administrador
  { path: "/reports", label: "Reportes Admin", minRole: "administrador" },
];

// Lógica de utilidad para validar el acceso por jerarquía
const isAllowed = (userRole: UserRole, minRole: UserRole): boolean => {
  const roles: UserRole[] = ["cliente", "usuario", "administrador"];

  const userLevel = roles.indexOf(userRole);
  const requiredLevel = roles.indexOf(minRole);

  return userLevel >= requiredLevel;
};

// Interfaz para las propiedades del componente
interface MenuProps {
  userRole: UserRole;
  userName?: string;
  isLoggedIn: boolean; // Indica si hay sesión activa
  onLoginToggle: (newRole: UserRole | null) => void; // Función para cambiar el estado
}

const Menu: React.FC<MenuProps> = ({
  userRole,
  userName = "Cliente",
  isLoggedIn,
  onLoginToggle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      // Cerrar sesión: pasa a 'cliente'
      onLoginToggle("cliente");
    } else {
      // Iniciar sesión: simula un login como 'cliente'
      onLoginToggle("cliente");
    }
  };

  return (
    <header className={`header ${isMenuOpen ? "open" : ""}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="img/logo.png" alt="Logo" />
        </Link>

        {/* Menu principal */}
        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            {menuItems.map(
              (item) =>
                isAllowed(userRole, item.minRole) && (
                  <li key={item.path}>
                    <Link to={item.path} onClick={toggleMenu}>
                      {item.label}
                      {item.minRole === "administrador" && (
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          style={{ marginLeft: "5px" }}
                          title="Solo Administrador"
                        />
                      )}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </nav>

        {/* Iconos de utilidad y estado de sesión */}
        <div className="utility-icons">
          <div className="user-info">
            <small>Rol: **{userRole}**</small>
          </div>

          {/* Iconos de Carrito y Cuenta solo será visibles si está logueado */}
          {isLoggedIn && (
            <>
              <Link to="/cuenta" className="user-icon" title="Mi Cuenta">
                <FontAwesomeIcon icon={faUser} />
              </Link>
              <Link to="/pago" className="cart-icon" title="Mi Carrito">
                <FontAwesomeIcon icon={faShoppingCart} />
              </Link>
            </>
          )}

          {/* Boton de Login/Logout */}
          <button
            onClick={handleLoginToggle}
            className="login-toggle-btn"
            title={isLoggedIn ? "Cerrar Sesión" : "Iniciar Sesión"}
          >
            <FontAwesomeIcon icon={isLoggedIn ? faSignOutAlt : faSignInAlt} />
          </button>

          {/* Btn Hamburguesa*/}
          <button
            className="hamburger-menu"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Menu;
