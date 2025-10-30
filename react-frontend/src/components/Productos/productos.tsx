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


const Productos: React.FC = () => {
    // Estado para manejar la apertura/cierre del menú móvil (REFACTORIZACIÓN)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };
    
    return (
        <>
            <header className="site-header">
                <div className="logo">
                    <img src="img/logo.png" alt="Casa del Chantilly" />
                    Casa del Chantilly
                </div>
                {/* CLASE CONDICIONAL: Usa el estado isMenuOpen */}
                <nav id="main-nav" className={`main-nav ${isMenuOpen ? 'active' : ''}`} aria-label="Menú principal">
                    <a href="index.html">Inicio</a>
                    <a href="nosotros.html">Nosotros</a>
                    <a href="productos.html">Productos</a>
                    <a href="tiendas.html">Tiendas</a>
                    
                    <a href="cuenta.html" className="mobile-nav-link">
                        <FontAwesomeIcon icon={faUser} /> Cuenta
                    </a>
                    
                    <a href="pago.html" className="mobile-nav-link">
                        <FontAwesomeIcon icon={faShoppingCart} /> Carrito
                    </a>
                </nav>
                
                {/*EVENTO para alternar el estado del menú */}
                <div className="menu-toggle" id="menu-toggle" onClick={toggleMenu}>☰</div>
            </header>
            
            <section className="productos">
                <h1>Nuestros Productos</h1>
                <div className="grid">
                    <div className="card">
                        <img src="img/Bocaditos.jpg" alt="Torta" />
                        <h3>Torta Clásica</h3>
                        <p>S/ 50.00</p>
                        <a href="pago.html" className="btn">Comprar</a>
                    </div>
                    <div className="card">
                        <img src="img/box.jpg" alt="Torta" />
                        <h3>Torta Especial</h3>
                        <p>S/ 65.00</p>
                        <a href="pago.html" className="btn">Comprar</a>
                    </div>
                    <div className="card">
                        <img src="img/capibara.jpg" alt="Torta" />
                        <h3>Torta Especial</h3>
                        <p>S/ 65.00</p>
                        <a href="pago.html" className="btn">Comprar</a>
                    </div>
                    <div className="card">
                        <img src="img/cheesecake.jpg" alt="Torta" />
                        <h3>Torta Especial</h3>
                        <p>S/ 65.00</p>
                        <a href="pago.html" className="btn">Comprar</a>
                    </div>
                    <div className="card">
                        <img src="img/cuchareables.jpg" alt="Torta" />
                        <h3>Torta Especial</h3>
                        <p>S/ 65.00</p>
                        <a href="pago.html" className="btn">Comprar</a>
                    </div>
                    <div className="card">
                        <img src="img/galletas.jpg" alt="Torta" />
                        <h3>Torta Especial</h3>
                        <p>S/ 65.00</p>
                        <a href="pago.html" className="btn">Comprar</a>
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
                            <a href="https://www.facebook.com/LaCasadelChantillyOficial" className="social-icon facebook" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="https://instagram.com/lacasadelchantilly" className="social-icon instagram" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
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

export default Productos;