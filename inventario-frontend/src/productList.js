import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
    // 'useState' es la memoria del componente. Aquí guardaremos la lista de productos.
    const [products, setProducts] = useState([]);
    // NUEVO: Estado para guardar el término de búsqueda que el usuario escribe
    const [searchTerm, setSearchTerm] = useState('');

    // 'useEffect' ejecuta código cuando el componente se carga por primera vez.
    useEffect(() => {
        // Hacemos la petición GET a nuestro backend Quarkus.
        axios.get('http://localhost:8080/productos')
            .then(response => {
                // Cuando la respuesta llega, guardamos los productos en nuestro estado.
                setProducts(response.data);
            })
            .catch(error => {
                console.error('¡Hubo un error al obtener los productos!', error);
            });
    }, []); // El array vacío significa que esto se ejecuta solo una vez.

    // NUEVO: Función para manejar la eliminación de un producto
    const handleDelete = (productId) => {
        // Pedimos confirmación al usuario para evitar borrados accidentales
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            axios.delete(`http://localhost:8080/productos/${productId}`)
                .then(response => {
                    alert('¡Producto eliminado con éxito!');
                    // Actualizamos la lista de productos en el frontend sin recargar la página
                    // Filtramos el array, quedándonos solo con los productos cuyo ID no coincide con el eliminado
                    setProducts(products.filter(p => p.idProduct !== productId));
                })
                .catch(error => {
                    console.error('¡Hubo un error al eliminar el producto!', error);
                    alert('Error al eliminar el producto.');
                });
        }
    };

    // NUEVO: Lógica de filtrado
    // Filtramos la lista de productos basándonos en el searchTerm
    // Comparamos los nombres de los productos (en minúsculas) con el término de búsqueda (también en minúsculas)
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Lista de Productos</h2>
            {/* NUEVO: Campo de búsqueda */}
            <input
                type="text"
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', width: '300px', padding: '8px' }}
            />
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
                    {/* 'map' recorre el array de productos y crea una fila por cada uno */}
                    {filteredProducts.map(product => (
                    
                        <tr key={product.idProduct}>
                            <td>{product.idProduct}</td>
                            <td>{product.productName}</td>
                            <td>{product.productDescription}</td>
                            <td>{product.addedOn}</td>
                            <td>{product.idSupplier}</td>
                            <td>${product.productPrice}</td>
                            <td>{product.productQuantity}</td>
                            <td>
                                <button onClick={() => handleDelete(product.idProduct)}>
                                    Eliminar 🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;