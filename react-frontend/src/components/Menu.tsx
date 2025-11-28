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
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";

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

  { path: "/worker/reports/users", label: "Reportes", minRole: "trabajador" },
  { path: "/admin/recipes/create", label: "Recetas", minRole: "administrador" },
];

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("cliente");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, removeFromCart, totalItems, totalPrice } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [fullName, setFullName] = useState("");

  const [profileImage, setProfileImage] = useState<string | null>(null);

  /* ---------- leer token y perfil ---------- */
  useEffect(() => {
    const tk = localStorage.getItem("token");
    if (!tk) return;
    try {
      const payload = JSON.parse(atob(tk.split(".")[1]));
      setEmail(payload.upn || "");
      setRole((payload.groups?.[0] as UserRole) || "cliente");
      setFullName(payload.name || payload.upn?.split("@")[0] || "");
      setCreatedAt(payload.createdAt || "");

      // Fetch profile image
      fetch("/api/cliente/profile", {
        headers: { Authorization: `Bearer ${tk}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch profile");
        })
        .then((data) => {
          if (data.fotoPerfil) setProfileImage(data.fotoPerfil);
        })
        .catch((err) => console.error("Error loading profile image:", err));

    } catch {
      setEmail("");
      setRole("cliente");
      setFullName("");
      setCreatedAt("");
      setProfileImage(null);
    }
  }, []);

  /* ---------- cerrar sesión ---------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------- filtros por rol ---------- */
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.minRole === "cliente") return true;
    if (item.minRole === "trabajador")
      return role === "trabajador" || role === "administrador";
    if (item.minRole === "administrador") return role === "administrador";
    return false;
  });

  const toggleMobileMenu = () => setIsMenuOpen((v) => !v);

  /* ---------- NAVEGACIÓN + DEPURACIÓN ---------- */
  const handleNav = (path: string) => {
    console.log("🚀 navegando a:", path);
    console.log("🔐 token:", localStorage.getItem("token"));
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-rose-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3">
            <img
              src="/logoV2.svg"
              alt="La Casa del Chantilly"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-yellow-100 tracking-tight">
              La Casa del <span className="text-yellow-300">Chantilly</span>
            </span>
          </Link>

          {/* Desktop nav – botones en lugar de Link */}
          <nav className="hidden md:flex space-x-6">
            {filteredMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  item.minRole === "administrador"
                    ? "text-yellow-300 hover:bg-rose-700"
                    : "text-white hover:text-yellow-200 hover:bg-rose-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {email && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-yellow-400 text-rose-900 hover:bg-yellow-300 transition duration-200"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-lg" />
                  )}
                  <span className="hidden sm:inline text-sm font-medium">
                    {fullName || email.split("@")[0]}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ease-out ${
                    dropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                    <div className="font-medium">{fullName || email}</div>
                    <div className="text-xs text-gray-500">
                      Miembro desde: {createdAt}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleNav("/account");
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-3 text-gray-400"
                    />
                    Editar perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
            {email && role === "cliente" && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setCartOpen((prev) => !prev)}
                  className="text-2xl text-white hover:text-yellow-200 transition relative"
                  title="Mi carrito"
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-rose-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Dropdown Carrito */}
                <div
                  className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ease-out z-50 ${
                    cartOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="p-4 border-b border-gray-100 bg-rose-50">
                    <h3 className="font-bold text-gray-800 flex items-center justify-between">
                      <span>Tu Carrito</span>
                      <span className="text-sm text-rose-600">{totalItems} items</span>
                    </h3>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-3xl mb-2 opacity-30" />
                        <p>Tu carrito está vacío</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {cart.map((item) => (
                          <div key={item.idProduct} className="p-3 flex items-center gap-3 hover:bg-gray-50">
                            <img 
                              src={item.productImage || "/placeholder.png"} 
                              alt={item.productName}
                              className="w-12 h-12 rounded-md object-cover bg-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                              <p className="text-xs text-gray-500">S/ {item.productPrice.toFixed(2)} x {item.quantity}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.idProduct)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-rose-600">S/ {totalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          handleNav("/pay");
                        }}
                        className="w-full bg-rose-600 text-white py-2 rounded-lg font-medium hover:bg-rose-700 transition shadow-md"
                      >
                        Ir a Pagar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!email && (
              <button
                onClick={() => handleNav("/login")}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-400 text-rose-900 text-sm font-medium hover:bg-yellow-300 transition duration-200"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </button>
            )}
            <button
              className="md:hidden text-2xl text-yellow-200 hover:text-white transition duration-200"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile menu – también botones */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col items-center space-y-3 py-4 bg-rose-700">
            {filteredMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNav(item.path);
                }}
                className={`w-full text-center px-4 py-2 rounded-md text-base font-medium ${
                  item.minRole === "administrador"
                    ? "text-yellow-300 hover:bg-rose-800"
                    : "text-white hover:text-yellow-200 hover:bg-rose-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Menu;
