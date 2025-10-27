import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUserCircle, // Para la imagen de perfil genérica
  faEnvelope, // Email
  faPhone, // Teléfono
  faCalendarAlt, // Fecha de registro
  faLock, // Contraseña
  faSignOutAlt, // Cerrar sesión
  faTrashAlt, // Eliminar cuenta
} from "@fortawesome/free-solid-svg-icons";
// Íconos de Marcas
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
// =======================================

import '../App.css';

const Account: React.FC = () => {
  // Estados simulados del usuario
  const [userName, setUserName] = useState("Usuario");
  const [userEmail, setUserEmail] = useState("fulanita@correo.com");
  const [fullName, setFullName] = useState("Fulanita de Tal");
  const [userPhone, setUserPhone] = useState("987654321");
  const [memberSince, setMemberSince] = useState("2023-08-15");
  const [userImage, setUserImage] = useState("img/user.png"); // Imagen de perfil
  // useEffect para cargar datos
  // useEffect para cargar datos
    useEffect(() => {
        // Logica a implemetar para cargar datos del usuario desde la API
        console.log("Cargando datos del usuario...");
    }, []);

    // Función de Logout
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        // Lógica de cierre de sesión
        alert('Sesión cerrada correctamente.');
    };

    // Manejador para eliminar cuenta
    const handleDeleteAccount = (e: React.MouseEvent) => {
        e.preventDefault();
        const confirmDelete = window.confirm(
            'ADVERTENCIA: Estás a punto de ELIMINAR tu cuenta de forma permanente. ¿Estás segura?'
        );
        if (confirmDelete) {
            // Lógica para llamar a la API y eliminar la cuenta
            alert('Cuenta eliminada. ¡Lamentamos que te vayas!');
        }
    };

    // Función de ejemplo para cambiar la imagen de perfil
    const handleImageChange = () => {
        alert('Funcionalidad de cambiar imagen de perfil a implementar.');
    };

    // Función para cambiar la contraseña: FALTA IMPLEMENTAR
    const handleChangePassword = () => {
        alert('Funcionalidad de cambiar contraseña a implementar.');
    };

  return (
    <>
      <main className="min-h-screen flex flex-col">
        {/* PROFILE SECTION*/}
        <section className="max-w-4xl mx-auto p-5 py-10 bg-white shadow-xl rounded-lg my-10 w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">
            Mi Cuenta
          </h1>

          {/* PROFILE HEADER*/}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 mb-6">
            <img
              src={userImage}
              alt={`${userName}'s Profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary cursor-pointer hover:opacity-80 transition"
              onClick={handleImageChange}
              title="Haz clic para cambiar imagen (no implementado)"
            />
            <div className="text-center sm:text-left">
              <p
                id="profile-welcome"
                className="text-2xl font-semibold text-text-dark"
              >
                Hola, **{userName}**!
              </p>
              <p className="text-gray-600">¡Bienvenido de vuelta!</p>
            </div>
          </div>

          {/*Detalles de la cuenta */}
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-text-dark p-3 rounded-t-lg mb-4 detail-group-header">
              <h3 className="text-xl font-semibold">Datos Personales</h3>
            </div>
            <div className="space-y-3">
              {/* Nombre Completo */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="text-primary"
                  />{" "}
                  Nombre Completo:
                </span>
                <span className="text-text-dark">{fullName}</span>
              </div>
              {/* Correo Electrónico */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary" />{" "}
                  Correo Electrónico:
                </span>
                <span className="text-text-dark">{userEmail}</span>
              </div>
              {/* Teléfono */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-primary" />{" "}
                  Teléfono:
                </span>
                <span className="text-text-dark">{userPhone}</span>
              </div>
              {/* Miembro Desde */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-primary"
                  />{" "}
                  Miembro Desde:
                </span>
                <span className="text-text-dark">{memberSince}</span>
              </div>
            </div>

            {/* Opciones de Seguridad y Cuenta */}
            <div className="bg-text-dark p-3 rounded-t-lg mt-8 mb-4 detail-group-header">
              <h3 className="text-xl font-semibold">Seguridad y Cuenta</h3>
            </div>

            {/* Botón Cambiar Contraseña */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-semibold text-gray-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-primary" />{" "}
                Contraseña:
              </span>
              <button
                className="bg-secondary text-text-dark px-4 py-2 rounded-md hover:bg-yellow-400 transition text-sm flex items-center gap-2 font-semibold"
                onClick={handleChangePassword}
              >
                <FontAwesomeIcon icon={faLock} /> Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center sm:justify-start gap-2 font-bold"
              onClick={handleDeleteAccount}
            >
              <FontAwesomeIcon icon={faTrashAlt} /> Eliminar Cuenta
            </button>
            <button
              className="bg-primary text-text-light px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center sm:justify-start gap-2 font-bold"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
          </div>
        </section>

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20tengo%20una%20consulta%20sobre%20mi%20cuenta."
          className="fixed bottom-6 right-6 p-4 rounded-full bg-whatsapp text-white shadow-xl hover:bg-green-600 transition duration-300 z-50 text-3xl flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          title="Chatea con nosotros por WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </main>

      {/* FOOTER */}
      <footer className="bg-text-dark text-text-light py-10">
        <div className="flex flex-wrap justify-around max-w-7xl mx-auto px-5 gap-8">
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              La Casa del Chantilly
            </h3>
            <p className="mb-2 text-sm">Endulzando tus momentos desde 1995.</p>
          </div>
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              Enlaces Rápidos
            </h3>
            <Link
              to="/inicio"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Productos
            </Link>
            <Link
              to="/nosotros"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Nosotros
            </Link>
            <Link
              to="/tiendas"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Tiendas
            </Link>
            <Link
              to="/contacto"
              className="block text-sm mb-2 hover:text-primary transition"
            >
              Contacto
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">Contáctanos</h3>
            <p className="mb-2 text-sm">
              <a
                href="mailto:ventas@chantilly.com"
                className="hover:text-primary transition"
              >
                ventas@chantilly.com
              </a>
            </p>
            <p className="mb-2 text-sm">
              <a
                href="tel:+51930263546"
                className="hover:text-primary transition"
              >
                (+51) 930 263 546
              </a>
            </p>
            <Link
              to="/tiendas"
              className="block text-sm mt-4 text-primary hover:text-white transition"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{" "}
              Dirección física
            </Link>
          </div>
          <div className="w-full md:w-1/2 lg:flex-basis-col-3-minus-40 min-w-250">
            <h3 className="text-xl font-bold mb-4 text-primary">
              Síguenos en nuestras redes sociales
            </h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/LaCasadelChantillyOficial"
                className="text-2xl hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="https://instagram.com/lacasadelchantilly"
                className="text-2xl hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://tiktok.com/@lacasadelchantilly_ofi"
                className="text-2xl hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-400 px-5">
          <p>
            LA CASA DEL CHANTILLY S.A.C. | 20552150148 © Todos los derechos
            reservados
          </p>
          <p className="mt-1">Diseño web: Husky</p>
        </div>
      </footer>
    </>
  );
};

export default Account;
