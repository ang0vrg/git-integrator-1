import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import '../App.css';

type Producto = {
  idProduct?: number;
  productName?: string;
  productDescription?: string;
  productQuantity?: number;
  productPrice?: number;
  productImageId?: string | number;
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/productos');
        if (!res.ok) {
          console.warn('Failed to fetch products', res.status);
          setProducts([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        // initialize quantities
        const q: Record<string | number, number> = {};
        (data || []).forEach((p: any) => {
          q[p.idProduct ?? p.id ?? p.productName] = 1;
        });
        setQuantities(q);
      } catch (err) {
        console.error('Error loading products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (key: string | number, value: number, max = 1) => {
    const v = Math.max(1, Math.min(value, max));
    setQuantities((prev) => ({ ...prev, [key]: v }));
  };

  const handleBuy = (product: Producto) => {
    const key = product.idProduct ?? product.productName ?? 'unknown';
    const qty = quantities[key] ?? 1;
    // For now simulate add-to-cart
    alert(`Agregaste ${qty} x ${product.productName} al carrito`);
    // TODO: integrate real cart / backend order flow
  };

  const filtered = products.filter((p) => {
    if (!filterQuery) return true;
    return (p.productName || '')!.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <>
      <Menu />

      <main className="min-h-screen flex flex-col bg-gray-50">
        {/* HERO similar to contact with overlay */}
        <section className="relative bg-[url('/img/products-hero.jpg')] bg-cover bg-center h-[40vh] md:h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-white text-center p-5 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">Nuestros Productos</h1>
            <p className="text-lg drop-shadow-lg">Elige y disfruta de nuestras especialidades</p>
          </div>
        </section>

        {/* CONTENT: left filter + right grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* LEFT FILTER */}
            <aside className="md:col-span-1 bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4">Filtrar Productos</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Buscar</label>
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Disponibilidad</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg">
                  <option value="">Todos</option>
                  <option value="in">En stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rango de Precio</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-200 rounded-lg" />
                  <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
            </aside>

            {/* RIGHT GRID */}
            <div className="md:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Catálogo</h2>
                <div className="text-sm text-gray-600">{products.length} productos</div>
              </div>

              {loading ? (
                <div>Cargando productos...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filtered.length > 0 ? (
                    filtered.map((p) => {
                      const key = p.idProduct ?? p.productName ?? Math.random();
                      const stock = p.productQuantity ?? 0;
                      const qty = quantities[key] ?? 1;
                      return (
                        <div key={key} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
                          <img
                            src={p.productImageId ? `/api/imagenes/${p.productImageId}` : '/img/tortaClasica.png'}
                            alt={p.productName}
                            className="h-44 w-full object-cover rounded-md mb-4"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{p.productName}</h3>
                            <p className="text-sm text-gray-600 my-2">{p.productDescription}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-rose-700 font-bold">S/ {p.productPrice?.toFixed ? p.productPrice.toFixed(2) : p.productPrice}</div>
                              <div className="text-sm text-gray-600">Stock: {stock}</div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <input
                              type="number"
                              min={1}
                              max={stock}
                              value={qty}
                              onChange={(e) => handleQuantityChange(key, Number(e.target.value), stock)}
                              className="w-20 p-2 border border-gray-200 rounded-lg text-center"
                            />
                            <button
                              onClick={() => handleBuy(p)}
                              className="ml-auto px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faShoppingCart} /> Comprar
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-600">No hay productos disponibles.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly%2C%20quisiera%20hacer%20un%20pedido."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 p-4 rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition z-50 text-3xl"
          title="Chatea con nosotros"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </a>
      </main>

      <Footer />
    </>
  );
};

export default Products;
