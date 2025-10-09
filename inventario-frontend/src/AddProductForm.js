import React, { useState } from 'react';
import axios from 'axios';

function AddProductForm() {
    // Creamos un estado para cada campo del formulario.
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    // Asumimos que tienes al menos un proveedor con ID 1 para el ejemplo
    const [idSupplier, setIdSupplier] = useState(1); 

    const handleSubmit = (event) => {
        // Evita que la página se recargue al enviar el formulario.
        event.preventDefault();

        const newProduct = {
            productName: productName,
            productDescription: 'Descripción por defecto', // Puedes añadir un campo para esto
            productPrice: parseFloat(productPrice),
            productQuantity: parseInt(productQuantity),
            idSupplier: parseInt(idSupplier)
        };

        // Hacemos la petición POST para crear el nuevo producto.
        axios.post('http://localhost:8080/productos', newProduct)
            .then(response => {
                alert('¡Producto añadido con éxito!');
                // Opcional: Limpiar el formulario o actualizar la lista de productos.
                window.location.reload(); // Forma simple de actualizar la lista
            })
            .catch(error => {
                console.error('¡Hubo un error al añadir el producto!', error);
                alert('Error al añadir el producto.');
            });
    };

    return (
        <div>
            <h2>Añadir Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Nombre del producto" required />
                <br/><br/>
                <input type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Precio" step="0.01" required />
                <br/><br/>
                <input type="number" value={productQuantity} onChange={e => setProductQuantity(e.target.value)} placeholder="Cantidad en Stock" required />
                <br/><br/>
                {/* Puedes hacer esto un <select> para elegir proveedores */}
                <input type="number" value={idSupplier} onChange={e => setIdSupplier(e.target.value)} placeholder="ID del Proveedor" required />
                <br/><br/>
                <button type="submit">Añadir Producto</button>
            </form>
        </div>
    );
}

export default AddProductForm;