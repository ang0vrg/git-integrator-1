import React, { useState } from 'react';

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
// Íconos de Marcas (fab)
import { 
    faWhatsapp, 
    faFacebookF, 
    faInstagram, 
    faTiktok 
} from '@fortawesome/free-brands-svg-icons';
// =======================================


const Index: React.FC = () => {
    // Estado para manejar la apertura/cierre del menú móvil (REFACTORIZACIÓN)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // La lógica de carrusel y pop-up debería ir aquí usando useState y/o useRef.
    
    // El antiguo useEffect para el menú se ha ELIMINADO.
    
    return (
        <>
            <header className="site-header">
                <div className="logo">
                    <img src="img/logo.png" alt="Casa del Chantilly" />
                    Casa del Chantilly
                </div>
                {/* CLASE CONDICIONAL: Si isMenuOpen es true, añade 'active' */}
                <nav id="main-nav" className={`main-nav ${isMenuOpen ? 'active' : ''}`} aria-label="Menú principal">
                    <a href="index.html">Inicio</a>
                    <a href="nosotros.html">Nosotros</a>
                    <a href="productos.html">Productos</a>
                    <a href="tiendas.html">Tiendas</a>
                    
                    {/* REEMPLAZO 1: Ícono Cuenta */}
                    <a href="cuenta.html" className="mobile-nav-link">
                        <FontAwesomeIcon icon={faUser} /> Cuenta
                    </a>
                    
                    {/* REEMPLAZO 2: Ícono Carrito */}
                    <a href="pago.html" className="mobile-nav-link">
                        <FontAwesomeIcon icon={faShoppingCart} /> Carrito
                    </a>
                </nav>
                
                {/* MANEJADOR DE EVENTO para alternar el estado del menú */}
                <div className="menu-toggle" id="menu-toggle" onClick={toggleMenu}>
                    ☰
                </div>
            </header>
            
            <section className="hero-banner">
                <div className="hero-text hero-box">
                    <h1>
                        Revoluciona tus <br />
                        sentidos con sabores <br />
                        <span className="highlight">QUE INSPIRAN...</span>
                    </h1>
                </div>
                <div className="hero-content hero-content-box">
                    <div className="hero-video-container">
                        <video autoPlay loop muted playsInline className="hero-video">
                            <source src="img/inicioVideo.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </section>

            <section className="productos-destacados">
                <h2>¡Lo más vendido!</h2>
                <div className="carousel-container">
                    <button className="carousel-btn prev-btn" aria-label="Anterior">&#10094;</button>
                    <div className="carousel-track" id="carouselTrack">
                        <div className="card">
                            <img src="img/img1.jpg" alt="Torta" />
                            <h3>Torta Helada</h3>
                            <p>S/ 50.00</p>
                        </div>
                        <div className="card">
                            <img src="img/img2.jpg" alt="Torta" />
                            <h3>Tres leches de Pisco Sour</h3>
                            <p>S/ 50.00</p>
                        </div>
                        <div className="card">
                            <img src="img/img3.jpg" alt="Torta" />
                            <h3>Torta Calabacin</h3>
                            <p>S/ 45.00</p>
                        </div>
                        <div className="card">
                            <img src="img/img4.jpg" alt="Torta" />
                            <h3>Naked de Toffe</h3>
                            <p>S/ 55.00</p>
                        </div>
                        <div className="card">
                            <img src="img/img5.png" alt="Torta" />
                            <h3>Torta de Chocolate</h3>
                            <p>S/ 60.00</p>
                        </div>
                    </div>
                    <button className="carousel-btn next-btn" aria-label="Siguiente">&#10095;</button>
                </div>
                <a href="productos.html" className="btn">Ver más</a>
            </section>
            
            <div id="promoEmergente" className="VentanaEmergente">
                <div className="promo-content">
                    <span className="close-btn">&times;</span>
                    <h2>¡Endulza tus promos!</h2>
                    <div className="promo-grid">
                        <div className="promo-card" data-product="Torta Helada">
                            <img src="img/promoEmer.jpg" alt="Torta Helada Promo" />
                            <h4>45% en cuchareables</h4>
                        </div>
                        <div className="promo-card" data-product="Pisco Sour">
                            <img src="img/promoEmer2.jpg" alt="Tres Leches Promo" />
                            <h4>🚨¡SOLO POR HOY!🚨</h4>
                        </div>
                        <div className="promo-card" data-product="Torta Calabacin">
                            <img src="img/promoEmer3.jpg" alt="Torta Calabacín Promo" />
                            <h4>Aprovecha el 20% de descuento</h4>
                        </div>
                    </div>
                    <p>¡Haz clic en una promoción para más detalles!</p>
                    <a href="productos.html" className="btn promo-btn">Ver todas las promociones</a>
                </div>
            </div>

            {/* REEMPLAZO 3: Botón flotante de WhatsApp */}
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
                        {/* REEMPLAZO 4: Ícono Contacto */}
                        <a href="contacto.html" className="footer-title-link">
                            <FontAwesomeIcon icon={faLink} /> Contacto
                        </a>
                    </div>

                    <div className="footer-col info-col">
                        {/* REEMPLAZO 5: Ícono Dirección */}
                        <a href="tiendas.html" className="footer-title-link">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección física
                        </a>
                    </div>

                    <div className="footer-col social-col">
                        <h3>Síguenos en nuestras redes sociales</h3>
                        <div className="social-icons">
                            {/* REEMPLAZO 6: Ícono Facebook */}
                            <a href="https://www.facebook.com/LaCasadelChantillyOficial" className="social-icon facebook" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            {/* REEMPLAZO 7: Ícono Instagram */}
                            <a href="https://instagram.com/lacasadelchantilly" className="social-icon instagram" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            {/* REEMPLAZO 8: Ícono TikTok */}
                            <a href="https://tiktok.com/@lacasadelchantilly_ofi" className="social-icon tiktok" target="_blank" rel="noopener noreferrer">
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

export default Index;