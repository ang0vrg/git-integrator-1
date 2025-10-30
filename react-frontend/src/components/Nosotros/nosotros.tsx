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
// Íconos de Marcas
import { 
    faWhatsapp, 
    faFacebookF, 
    faInstagram, 
    faTiktok 
} from '@fortawesome/free-brands-svg-icons';
// =======================================


const Nosotros: React.FC = () => {
    // 1. Estado para manejar el cambio de fondo de Misión/Visión
    const [currentBackground, setCurrentBackground] = useState('');

    // 2. Estado para manejar la apertura/cierre del menú móvil(REFACTORIZACIÓN)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Funciones para manejar el hover de Misión/Visión
    const cambiarFondo = (tipo: 'mision' | 'vision') => {
        setCurrentBackground(tipo);
    };

    const restaurarFondo = () => {
        setCurrentBackground('');
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

            <section className={`nosotros-hero ${currentBackground}`} id="nosotros-section">
                <div className="nosotros-background">
                    <div className="overlay">
                        <h1 className="nosotros-title">Nuestra Historia</h1>
                        <p className="nosotros-text">La Casa del Chantilly es la materialización de la pasión, la visión y la perseverancia de nuestra fundadora, la ingeniera en Ciencias Alimentarias María Macassi.</p>
                        <p className="nosotros-text">Lo que comenzó en el 2002 como un sueño en Lima Norte, inspirado en el refinamiento de la pastelería elegante, se ha convertido en un auténtico imperio repostero con más de 22 sucursales y un nombre que es sinónimo de calidad inigualable en Lima.</p>
                        <p className="nosotros-text">Cada producto que creamos lleva el sello de la innovación y la dedicación que María ha puesto en cada paso, desde sus humildes inicios hasta consolidar nuestra marca como un referente en la repostería limeña.</p>
                        <p className="nosotros-text">La Casa del Chantilly no solo vende postres, sino que ofrece una experiencia única, siempre enfocada en la excelencia del sabor y la presentación. Somos el ejemplo vivo de que con esfuerzo y visión, es posible transformar un profundo amor por la pastelería en un negocio exitoso y en constante crecimiento.</p>
                    </div>
                </div>

                <div className="mision-vision-container">
                    <div 
                        className="mision-box" 
                        onMouseEnter={() => cambiarFondo('mision')} 
                        onMouseLeave={restaurarFondo}
                    >
                        <h2 className="mision-title">Misión</h2>
                        <p>Ofrecer productos exclusivos con un estilo de vida constante, equilibrado y lleno de sabor.</p>
                    </div>
                    <div 
                        className="vision-box" 
                        onMouseEnter={() => cambiarFondo('vision')} 
                        onMouseLeave={restaurarFondo}
                    >
                        <h2 className="vision-title">Visión</h2>
                        <p>Ser la cadena de pastelería saludable líder, reconocida por la calidad y frescura de sus productos.</p>
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

export default Nosotros;