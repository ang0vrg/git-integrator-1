import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './listaEstilos.css';
import './styles.css';

function Proveedores() {
    // --- ESTADOS ADAPTADOS PARA PROVEEDORES ---
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para el formulario de "Añadir Proveedor"
    const [supplierName, setSupplierName] = useState('');
    const [supplierContact, setSupplierContact] = useState('');
    const [supplierPhone, setSupplierPhone] = useState('');

    // Estados para el modal de edición
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [editFormData, setEditFormData] = useState({ supplierName: '', supplierContact: '', supplierPhone: '' });

    // --- LÓGICA DE DATOS ---
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        axios.get('http://localhost:8080/proveedores')
            .then(response => setSuppliers(response.data))
            .catch(error => console.error('Error al obtener proveedores:', error));
    };

    // --- FUNCIONES CRUD ADAPTADAS ---
    const handleAddSupplier = (event) => {
        event.preventDefault();
        const newSupplier = { supplierName, supplierContact, supplierPhone };
        axios.post('http://localhost:8080/proveedores', newSupplier)
            .then(() => {
                alert('¡Proveedor añadido con éxito!');
                fetchSuppliers();
                setSupplierName(''); setSupplierContact(''); setSupplierPhone('');
            })
            .catch(error => console.error('Error al añadir proveedor:', error));
    };

    const handleDelete = (supplierId) => {
        if (window.confirm('¿Seguro que quieres eliminar este proveedor?')) {
            axios.delete(`http://localhost:8080/proveedores/${supplierId}`)
                .then(() => {
                    alert('Proveedor eliminado');
                    fetchSuppliers();
                })
                .catch(error => console.error('Error al eliminar proveedor:', error));
        }
    };

    const handleEditClick = (supplier) => {
        setEditingSupplier(supplier);
        setEditFormData({
            supplierName: supplier.supplierName,
            supplierContact: supplier.supplierContact,
            supplierPhone: supplier.supplierPhone
        });
    };
    
    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSupplier = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8080/proveedores/${editingSupplier.idSupplier}`, editFormData)
            .then(() => {
                alert('¡Proveedor actualizado con éxito!');
                setEditingSupplier(null);
                fetchSuppliers();
            })
            .catch(error => console.error('Error al actualizar proveedor:', error));
    };

    // --- LÓGICA DE BÚSQUEDA ---
    const filteredSuppliers = suppliers.filter(s =>
        s.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventario-container">
            <header className="site-header"><div className="logo">
                        <img src="img/logo" alt="" />Casa del Chantilly
                    </div>
                    <nav id="main-nav" className="main-nav" aria-label="Menú principal">
                        <a href="index.html">Inicio</a>
                        <Link to="/inventario">Inventario</Link>
                        <Link to="/proveedores">Proveedores</Link>
                        <a href="nosotros.html">Nosotros</a>
                        <a href="productos.html">Productos</a>
                        <a href="tiendas.html">Tiendas</a>
                        <a href="cuenta.html" className="mobile-nav-link"><i className="fas fa-user"></i> Cuenta</a>
                        <a href="pago.html" className="mobile-nav-link"><i className="fas fa-shopping-cart"></i> Carrito</a>
                    </nav>
                    <div className="menu-toggle" id="menu-toggle">☰</div></header>
            
            <section className="productos">
                <h1>Gestión de Proveedores</h1>
                
                {/* FORMULARIO PARA AÑADIR */}
                <div>
                    <h2>Añadir Nuevo Proveedor</h2>
                    <form onSubmit={handleAddSupplier}>
                        <input type="text" placeholder="Nombre del proveedor" required value={supplierName} onChange={e => setSupplierName(e.target.value)} />
                        <input type="email" placeholder="Contacto (email)" required value={supplierContact} onChange={e => setSupplierContact(e.target.value)} />
                        <input type="tel" placeholder="Teléfono" required value={supplierPhone} onChange={e => setSupplierPhone(e.target.value)} />
                        <button type="submit">Añadir Proveedor</button>
                    </form>
                </div>

                <hr />

                {/* BÚSQUEDA Y LISTA */}
                <h2>Lista de Proveedores</h2>
                <input
                    type="text"
                    placeholder="Buscar proveedores..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '20px', width: '300px', padding: '8px' }}
                />
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Contacto (Correo)</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map(supplier => (
                            <tr key={supplier.idSupplier}>
                                <td>{supplier.idSupplier}</td>
                                <td>{supplier.supplierName}</td>
                                <td>{supplier.supplierContact}</td>
                                <td>{supplier.supplierPhone}</td>
                                <td>
                                    <button onClick={() => handleEditClick(supplier)} style={{ marginRight: '10px' }}>Editar ✏️</button>
                                    <button onClick={() => handleDelete(supplier.idSupplier)}>Eliminar 🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* MODAL DE EDICIÓN */}
            {editingSupplier && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editando Proveedor</h2>
                        <form onSubmit={handleUpdateSupplier}>
                            <input type="text" name="supplierName" value={editFormData.supplierName} onChange={handleEditFormChange} required />
                            <input type="email" name="supplierContact" value={editFormData.supplierContact} onChange={handleEditFormChange} required />
                            <input type="tel" name="supplierPhone" value={editFormData.supplierPhone} onChange={handleEditFormChange} required />
                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={() => setEditingSupplier(null)} style={{ marginLeft: '10px' }}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
            <footer><p>© 2025 La Casa del Chantilly</p></footer>
        </div>
    );
}

export default Proveedores;