// src/pages/Account.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUserCircle,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faLock,
  faSignOutAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import "../App.css";

const Account: React.FC = () => {
  // Estados simulados
  const [userName] = useState("Usuario");
  const [userEmail] = useState("fulanita@correo.com");
  const [fullName] = useState("Fulanita de Tal");
  const [userPhone] = useState("987654321");
  const [memberSince] = useState("2023-08-15");
  const [userImage] = useState("img/user.png");

  useEffect(() => console.log("Cargando datos del usuario..."), []);

  const handleLogout = () => alert("Sesión cerrada correctamente.");
  const handleDeleteAccount = () => {
    if (window.confirm("¿Eliminar tu cuenta permanentemente?"))
      alert("Cuenta eliminada. ¡Lamentamos que te vayas!");
  };
  const handleImageChange = () => alert("Cambiar imagen - no implementado");
  const handleChangePassword = () =>
    alert("Cambiar contraseña - no implementado");

  return (
    <>
      <Menu />

      <main className="min-h-screen flex flex-col bg-gray-50">
        <section className="max-w-4xl mx-auto p-5 py-10 bg-white shadow-xl rounded-lg my-10 w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-rose-600">
            Mi Cuenta
          </h1>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 mb-6">
            <img
              src={userImage}
              alt={`${userName}'s Profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-rose-600 cursor-pointer hover:opacity-80 transition"
              onClick={handleImageChange}
              title="Cambiar imagen (no implementado)"
            />
            <div className="text-center sm:text-left">
              <p className="text-2xl font-semibold text-gray-800">
                Hola, {userName}!
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
                label="Nombre Completo"
                value={fullName}
              />
              <Field
                icon={faEnvelope}
                label="Correo Electrónico"
                value={userEmail}
              />
              <Field icon={faPhone} label="Teléfono" value={userPhone} />
              <Field
                icon={faCalendarAlt}
                label="Miembro Desde"
                value={memberSince}
              />
            </div>

            {/* Seguridad */}
            <div className="bg-gray-800 text-white p-3 rounded-t-lg mt-8">
              <h3 className="text-xl font-semibold">Seguridad y Cuenta</h3>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-rose-600" />
                Contraseña:
              </span>
              <button
                onClick={handleChangePassword}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-300 transition text-sm font-semibold"
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-bold"
            >
              <FontAwesomeIcon icon={faTrashAlt} /> Eliminar Cuenta
            </button>
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
