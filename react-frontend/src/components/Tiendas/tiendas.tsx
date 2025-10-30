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

import '../../assets/scss/main.scss';

const tiendasData = [
    {
        ciudad: 'Puente Piedra',
        imagen: 'img/PuentePiedra.png',
        direccion: 'Av. Puente Piedra 255, Puente Piedra 15118',
        horario: 'Lunes a domingo: 09:00 a.m. - 20:00 p.m.',
        ubicacionUrl: 'https://share.google/vDtjbexx4X9lT6Mi5',
    },
    {
        ciudad: 'Comas',
        imagen: 'img/comas1.png',
        direccion: 'Av. Universitaria 10677, Comas 15316',
        horario: 'Lunes a domingo: 08:00 a.m. - 23:00 p.m.',
        ubicacionUrl: 'https://share.google/ME6Gt4nxQHYZTKwuo',
    },
    {
        ciudad: 'Comas',
        imagen: 'img/comas2.png',
        direccion: 'Av. Victor Andrés Belaunde 121, Comas 15312',
        horario: 'Lunes a domingo: 08:00 a.m. - 23:00 p.m.',
        ubicacionUrl: 'https://share.google/a6015UEElRl5tPBQk',
    },
    {
        ciudad: 'Comas',
        imagen: 'img/comas3.png',
        direccion: 'Lt 176 de, Chacra Cerro 2B, Comas',
        horario: 'Lunes a domingo: 08:00 a.m. - 17:30 p.m.',
        ubicacionUrl: 'https://share.google/KykULOv1Bdvygj1QH',
    },
    {
        ciudad: 'Carabayllo',
        imagen: 'img/carabayllo.png',
        direccion: 'Miguel Grau 100, Carabayllo 15318',
        horario: 'Lunes a domingo: 08:00 a.m. - 22:00 p.m.',
        ubicacionUrl: 'https://share.google/mnYuaDLKKQxd7HkfV',
    },
    {
        ciudad: 'Los Olivos',
        imagen: 'img/LosOlivos.png',
        direccion: 'Av. Naranjal 1492, Los Olivos 15304',
        horario: 'Lunes a domingo: 08:00 a.m. - 00:00 a.m.',
        ubicacionUrl: 'https://share.google/vDtjbexx4X9lT6Mi5',
    },
    {
        ciudad: 'Los Olivos',
        imagen: 'img/LosOlivos2.png',
        direccion: 'Av. Marañon 650, Los Olivos 15304',
        horario: 'Lunes a domingo: 08:00 a.m. - 22:30 a.m.',
        ubicacionUrl: 'https://share.google/aCRZ4jpOTvo3VeyIo',
    },
    {
        ciudad: 'Cercado de Lima',
        imagen: 'img/Cercado.png',
        direccion: 'Manzanas 71, Cercado de Lima 15306',
        horario: 'Lunes a domingo: 08:00 a.m. - 23:00 p.m.',
        ubicacionUrl: 'https://share.google/XwGOOJFCzpuJZksgj',
    },
    {
        ciudad: 'San Martín de Porres',
        imagen: 'img/SanMartin.png',
        direccion: 'Sta. Maria De Los Angeles 664, San Martín de Porres 15113',
        horario: 'Lunes a domingo: 08:00 a.m. - 20:00 p.m.',
        ubicacionUrl: 'https://share.google/QevHDHdxgM5mcoImq',
    },
    {
        ciudad: 'San Miguel',
        imagen: 'img/SanMiguel.png',
        direccion: 'Av de los Precursores 330, San Miguel 15088',
        horario: 'Lunes a domingo: 08:00 a.m. - 23:00 p.m.',
        ubicacionUrl: 'https://share.google/XGthAGse35JfJiDkG',
    },
    {
        ciudad: 'Callao',
        imagen: 'img/Callao.png',
        direccion: 'Manzana A, Lote 2, Av. Bocanegra, Callao 07036',
        horario: 'Lunes a domingo: 08:00 a.m. - 22:00 p.m.',
        ubicacionUrl: 'https://share.google/j6lT3SJhHu2p9iB7W',
    },
    {
        ciudad: 'Callao',
        imagen: 'img/callao2.png',
        direccion: 'Centro comercial Minka, Av. Argentina 3093, Callao 07001',
        horario: 'Lunes a domingo: 09:00 a.m. - 00:00 a.m.',
        ubicacionUrl: 'https://share.google/F25NkY0D3aQrJ50uD',
    },
    {
        ciudad: 'Independencia',
        imagen: 'img/Independencia.png',
        direccion: 'Av. las Violetas 244, Independencia LIMA 28',
        horario: 'Lunes a domingo: 08:00 a.m. - 00:00 a.m.',
        ubicacionUrl: 'https://share.google/NmYru6L7tQrNnRb26',
    },
    {
        ciudad: 'Lima',
        imagen: 'img/lima.png',
        direccion: 'Av. Alfredo Benavides 5150, Lima 15039',
        horario: 'Lunes a domingo: 06:00 a.m. - 21:30 a.m.',
        ubicacionUrl: 'https://share.google/SkNeXVPZaajXx9rNe',
    },
];

const Tiendas: React.FC = () => {
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
            
            <section className="tiendas">
                <h1>¡Visítanos!</h1>
                <div className="grid">
                    {tiendasData.map((tienda, index) => (
                        <div className="card" key={index}>
                            <img src={tienda.imagen} alt={`Sucursal ${tienda.ciudad}`} />
                            <h3>{tienda.ciudad}</h3>
                            <p>{tienda.direccion}</p>
                            <p>{tienda.horario}</p>
                            <a 
                                href={tienda.ubicacionUrl} 
                                target="_blank" 
                                className="btn"
                                rel="noopener noreferrer"
                            >
                                Ver ubicación
                            </a>
                        </div>
                    ))}
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

export default Tiendas;