import React, { useState, useEffect } from 'react';

/* PARA QUE LOS ICONOS DE FONT AWESOME FUNCIONEN: 
    1. Asegúrate de tener Node.js instalado.
    2. Ejecuta 'npm install' en la terminal de la raíz del proyecto.
    3. Si F.A. aún no está instalado, corre:npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome @fortawesome/free-brands-svg-icons
*/

//IMPORTACIONES DE FONT AWESOME ===
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Íconos Sólidos (fas)
import { 
    faUser, 
    faShoppingCart, 
    faLink, 
    faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';
// Íconos de Marcas
import { 
    faWhatsapp, 
    faFacebookF, 
    faInstagram, 
    faTiktok 
} from '@fortawesome/free-brands-svg-icons';
// =======================================


const Cuenta: React.FC = () => {
    // 1. ESTADOS PARA DATOS DEL USUARIO
    const [userName, setUserName] = useState('Usuario');
    const [userEmail, setUserEmail] = useState('fulanita@correo.com');
    const [fullName, setFullName] = useState('Fulanita de Tal');

    // 2. ESTADO PARA MENÚ MÓVIL (Manejo React de la clase 'active')
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };
    
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        alert('Sesión cerrada correctamente.');
    };

    return (
        <>
            <header className="site-header">
                <div className="logo">
                    <img src="img/logo.png" alt="Logo Casa del Chantilly" />
                    Casa del Chantilly
                </div>
                {/* AÑADE CLASE CONDICIONAL: Si isMenuOpen es true, añade 'active' */}
                <nav id="main-nav" className={`main-nav ${isMenuOpen ? 'active' : ''}`} aria-label="Menú principal">
                    <a href="index.html">Inicio</a>
                    <a href="nosotros.html">Nosotros</a>
                    <a href="productos.html">Productos</a>
                    <a href="tiendas.html">Tiendas</a>
                    
                    <a href="cuenta.html" className="mobile-nav-link active">
                        <FontAwesomeIcon icon={faUser} /> Cuenta
                    </a>
                    
                    <a href="pago.html" className="mobile-nav-link">
                        <FontAwesomeIcon icon={faShoppingCart} /> Carrito
                    </a>
                </nav>
                
                <div className="menu-toggle" id="menu-toggle" onClick={toggleMenu}>
                    ☰
                </div>
            </header>

            <section className="profile-section">
                <div className="profile-container">
                    <h1 className="profile-title">Mi Cuenta</h1>

                    <div className="profile-header">
                        <img src="img/fotoPerfil.png" alt="Foto de Perfil" className="user-profile-large-img" />
                        <h2>Bienvenido/a, {userName}</h2> 
                    </div>

                    <div className="profile-details">
                        <div className="detail-group-header">
                            <h3>Datos: </h3>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{fullName}</span> 
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Correo:</span>
                            <span className="detail-value">{userEmail}</span> 
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Contraseña:</span>
                            <span className="detail-value">••••••••••</span>
                        </div>

                        <div className="detail-group-header security">
                            <h3>Seguridad:</h3>
                        </div>
                        <ul className="profile-actions">
                            <li><a href="#">Cambiar contraseña</a></li>
                            <li><a href="#" className="danger-action">Eliminar Cuenta</a></li>
                            <li><a href="#" onClick={handleLogout}>Cerrar sesión</a></li> 
                        </ul>
                    </div>
                </div>
            </section>

            <a
                href="http://wa.me/955122100"
                target="_blank"
                className="floating-wa-btn"
                aria-label="Chatea con nosotros por WhatsApp"
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faWhatsapp} />
            </a>

            <footer>
                <div className="footer-content">
                    <div className="footer-col info-col">
                        <h3>Horario de atención</h3>
                        <p>Lunes a Sábado: 9:00 am - 8:00 pm</p>
                        <p>Domingos y feriados: 10:00 am - 7:00 pm</p>
                    </div>

                    <div className="footer-col info-col">
                        <a href="contacto.html" className="footer-title-link">
                            <FontAwesomeIcon icon={faLink} /> Contacto
                        </a>
                    </div>

                    <div className="footer-col info-col">
                        <a href="tiendas.html" className="footer-title-link">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección física
                        </a>
                    </div>

                    <div className="footer-col social-col">
                        <h3>Síguenos en nuestras redes sociales</h3>
                        <div className="social-icons">
                            <a
                                href="https://www.facebook.com/LaCasadelChantillyOficial"
                                className="social-icon facebook"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a
                                href="https://instagram.com/lacasadelchantilly"
                                className="social-icon instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a
                                href="https://tiktok.com/@lacasadelchantilly_ofi"
                                className="social-icon tiktok"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faTiktok} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>LA CASA DEL CHANTILLY S.A.C. | 20552150148 © Todos los derechos reservados</p>
                    <p className="web-design">Diseño web: Husky</p>
                </div>
            </footer>
        </>
    );
};

export default Cuenta;