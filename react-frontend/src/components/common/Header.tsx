
function Header() {
  return (
    <header className="header">
      <div className="logo">La Casa del Chantilly</div>
      <nav>
        <a href="/">Inicio</a>
        <a href="/nosotros">Nosotros</a>
        <a href="/productos">Productos</a>
        <a href="/tiendas">Tiendas</a>
      </nav>
      <div className="icons">
        <a href="#"><i className="fas fa-user"></i> Cuenta</a>
        <a href="/pago"><i className="fas fa-shopping-cart"></i> Carrito</a>
      </div>
    </header>
  );
}

export default Header;
