import React, { useState, FormEvent } from 'react';

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


const Pago: React.FC = () => {
    // Estado para el resumen de compra (datos que vendrían de un carrito real)
    const [producto, setProducto] = useState('Torta Clásica');
    const [subtotal, setSubtotal] = useState(50.00);
    const [total, setTotal] = useState(50.00);
    
    // Estado para manejar la apertura/cierre del menú móvil (REFACTORIZACIÓN)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Función para manejar el envío del formulario de pago
    const handlePayment = (e: FormEvent) => {
        e.preventDefault();
        // Lógica de validación de tarjeta y procesamiento de pago real aquí
        console.log('Procesando pago...');
        alert(`Pago de S/ ${total.toFixed(2)} procesado (simulado). ¡Gracias por su compra!`);
        // Redireccionar al usuario a una página de confirmación
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
            
            <section className="pago">
                <h1>Resumen de su compra</h1>
                <div className="resumen">
                    <p>
                        <strong>Producto:</strong> {producto}
                    </p>
                    <p>
                        <strong>Subtotal:</strong> S/ {subtotal.toFixed(2)}
                    </p>
                    <p>
                        <strong>Total:</strong> S/ {total.toFixed(2)}
                    </p>
                </div>
                <h2>Formas de Pago</h2>
                <form onSubmit={handlePayment}>
                    <input type="text" placeholder="Nombre completo" required />
                    <input type="text" placeholder="Número de tarjeta" required />
                    <input type="text" placeholder="MM/AA" required />
                    <input type="text" placeholder="CVV" required />
                    <button type="submit" className="btn">Pagar</button>
                </form>
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

export default Pago;