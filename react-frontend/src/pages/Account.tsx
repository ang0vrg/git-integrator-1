// src/pages/Account.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faSignOutAlt,
  faIdBadge,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import "../App.css";

interface UserProfile {
  idUser: number;
  username: string;
  userEmail: string;
  userRole: string;
  phoneNumber: string | null;
  createdAt: string;
  lastAccess: string | null;
  active: boolean;
}

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("/api/cliente/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Error al cargar el perfil");
        }
      } catch (err) {
        setError("Error de conexión con el servidor");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      cliente: "Cliente",
      trabajador: "Trabajador",
      administrador: "Administrador",
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <>
        <Menu />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-5xl text-rose-600 animate-spin mb-4"
            />
            <p className="text-gray-600 text-lg">Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Menu />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || "No se pudo cargar el perfil"}</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition"
            >
              Volver al inicio
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Menu />

      <main className="min-h-screen flex flex-col bg-gray-50">
        <section className="max-w-4xl mx-auto p-5 py-10 bg-white shadow-xl rounded-lg my-10 w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-rose-600">
            Mi Perfil
          </h1>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-semibold text-gray-800">
                ¡Hola, {profile.username}!
              </p>
              <p className="text-gray-600">¡Bienvenido de vuelta!</p>
            </div>
          </div>

          {/* Datos personales */}
          <div className="space-y-6">
            <div className="bg-gray-800 text-white p-3 rounded-t-lg">
              <h3 className="text-xl font-semibold">Datos Personales</h3>
            </div>
            <div className="space-y-3 text-gray-800">
              <Field
                icon={faUserCircle}
                label="Nombre de Usuario"
                value={profile.username}
              />
              <Field
                icon={faEnvelope}
                label="Correo Electrónico"
                value={profile.userEmail}
              />
              <Field
                icon={faPhone}
                label="Teléfono"
                value={profile.phoneNumber || "No registrado"}
              />
              <Field
                icon={faIdBadge}
                label="Rol"
                value={getRoleName(profile.userRole)}
              />
              <Field
                icon={faCalendarAlt}
                label="Miembro Desde"
                value={formatDate(profile.createdAt)}
              />
              {profile.lastAccess && (
                <Field
                  icon={faCalendarAlt}
                  label="Último Acceso"
                  value={formatDate(profile.lastAccess)}
                />
              )}
            </div>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition flex items-center gap-2 font-bold"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

// Componente auxiliar para cada fila de dato
const Field: React.FC<{ icon: any; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <span className="font-semibold text-gray-700 flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="text-rose-600" />
      {label}:
    </span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default Account;
