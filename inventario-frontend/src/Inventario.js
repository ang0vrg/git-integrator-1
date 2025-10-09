import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import './listaEstilos.css';
// Aquí irán los imports de CSS

function Inventario() {
    // Aquí irá toda nuestra lógica de JavaScript (estados y funciones)
    // --- ESTADOS DEL COMPONENTE ---
    // Estado para la lista completa de productos desde la API
    const [products, setProducts] = useState([]);
    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para los campos del formulario de "Añadir Producto"
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [proveedorId, setProveedorId] = useState('');

    // --- EFECTO PARA CARGAR DATOS ---
    // Se ejecuta una vez cuando el componente se carga para obtener los productos
    useEffect(() => {
        fetchProducts();
    }, []);

    // --- FUNCIONES DE LÓGICA ---
    // Función para obtener los productos del backend
    const fetchProducts = () => {
        axios.get('http://localhost:8080/productos')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error al obtener productos:', error));
    };

    // Función para manejar el envío del formulario de "Añadir Producto"
    const handleAddProduct = (event) => {
        event.preventDefault(); // Evita que la página se recargue
        const newProduct = {
            productName: nombre,
            productDescription: descripcion,
            productPrice: parseFloat(precio),
            productQuantity: parseInt(stock),
            idSupplier: parseInt(proveedorId)
        };

        axios.post('http://localhost:8080/productos', newProduct)
            .then(response => {
                alert('¡Producto añadido con éxito!');
                fetchProducts(); // Vuelve a cargar la lista para mostrar el nuevo producto
                // Limpiar formulario
                setNombre('');
                setDescripcion('');
                setPrecio('');
                setStock('');
                setProveedorId('');
            })
            .catch(error => console.error('Error al añadir producto:', error));
    };

    // Función para eliminar un producto
    const handleDelete = (productId) => {
        if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
            axios.delete(`http://localhost:8080/productos/${productId}`)
                .then(response => {
                    alert('Producto eliminado');
                    fetchProducts(); // Vuelve a cargar la lista para reflejar la eliminación
                })
                .catch(error => console.error('Error al eliminar producto:', error));
        }
    };

    // Filtrar productos para la búsqueda en tiempo real
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <React.Fragment>
            <header className="site-header">
                <div className="logo">
                    <img src="img/logo" alt="" />Casa del Chantilly
                </div>
                <nav id="main-nav" className="main-nav" aria-label="Menú principal">
                    <a href="index.html">Inicio</a>
                    <a href="nosotros.html">Nosotros</a>
                    <a href="productos.html">Productos</a>
                    <a href="tiendas.html">Tiendas</a>
                    <a href="cuenta.html" className="mobile-nav-link"><i className="fas fa-user"></i> Cuenta</a>
                    <a href="pago.html" className="mobile-nav-link"><i className="fas fa-shopping-cart"></i> Carrito</a>
                </nav>
                <div className="menu-toggle" id="menu-toggle">☰</div>
            </header>
            <section className="productos">
                <h1>Inventario de Productos</h1>
                <div>
                    <h2>Buscar Producto</h2>
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre..."
                        style={{ marginBottom: '20px', width: '300px', padding: '8px' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <h2>Añadir Nuevo Producto</h2>
                    <form onSubmit={handleAddProduct}>
                        <input type="text" placeholder="Nombre del producto" required value={nombre} onChange={e => setNombre(e.target.value)} />
                        <br /><br />
                        <input type="text" placeholder="Descripción" required value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        <br /><br />
                        <input type="number" placeholder="Precio" step="0.01" required value={precio} onChange={e => setPrecio(e.target.value)} />
                        <br /><br />
                        <input type="number" placeholder="Cantidad en Stock" required value={stock} onChange={e => setStock(e.target.value)} />
                        <br /><br />
                        <input type="number" placeholder="ID del Proveedor" required value={proveedorId} onChange={e => setProveedorId(e.target.value)} />
                        <br /><br />
                        <button type="submit">Añadir Producto</button>
                    </form>
                </div>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Hora de ingreso</th>
                            <th>ID Proveedor</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.idProduct}>
                                <td>{product.idProduct}</td>
                                <td>{product.productName}</td>
                                <td>{product.productDescription}</td>
                                <td>{new Date(product.addedOn).toLocaleString()}</td>
                                <td>{product.idSupplier}</td>
                                <td>${product.productPrice}</td>
                                <td>{product.productQuantity}</td>
                                <td>
                                    <button onClick={() => handleDelete(product.idProduct)}>
                                        Eliminar
                                    </button>
                                    {/* Aquí podrías añadir un botón para editar */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <footer>
                <p>© 2025 La Casa del Chantilly</p>
            </footer>
        </React.Fragment>
    );
}

export default Inventario;