import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faPlus,
    faMinus
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import "../App.css";
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import { useCart } from '../context/CartContext';

interface Product {
  idProduct: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  categoria: string;
  porciones: number;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/productos');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.filter((p: Product) => p.productImage)); // Only show products with images
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductQuantity = (productId: number) => {
    const item = cart.find(i => i.idProduct === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleRemoveOne = (productId: number) => {
    const currentQty = getProductQuantity(productId);
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    if (totalItems > 0) {
      navigate('/pay');
    }
  };

  return (
    <>
      <Menu />
      <main className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Nuestros Productos</h1>
            <p className="text-pink-100">Deliciosos pasteles hechos con amor</p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const quantity = getProductQuantity(product.idProduct);
                return (
                  <div
                    key={product.idProduct}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="h-48 overflow-hidden bg-gray-200">
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {product.productName}
                        </h3>
                        <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-semibold rounded-full">
                          {product.categoria}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.productDescription || 'Delicioso producto artesanal'}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-pink-600">
                          S/ {product.productPrice.toFixed(2)}
                        </span>
                        {product.porciones && (
                          <span className="text-sm text-gray-500">
                            {product.porciones} porciones
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Controls */}
                      <div className="flex items-center gap-2">
                        {quantity > 0 ? (
                          <div className="flex items-center gap-3 w-full">
                            <button
                              onClick={() => handleRemoveOne(product.idProduct)}
                              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="text-xl font-bold min-w-[2rem] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2"
                          >
                            <FontAwesomeIcon icon={faShoppingCart} />
                            Agregar al Carrito
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Floating Cart Button */}
        {totalItems > 0 && (
          <button
            onClick={handleCheckout}
            className="fixed bottom-6 left-6 bg-pink-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-pink-700 transition-all duration-300 z-50 flex items-center gap-3"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
            <div className="text-left">
              <div className="text-sm font-semibold">{totalItems} items</div>
              <div className="text-xs">S/ {totalPrice.toFixed(2)}</div>
            </div>
          </button>
        )}

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/930263546?text=Hola%20La%20Casa%20del%20Chantilly,%20tengo%20una%20consulta."
          className="fixed bottom-6 right-6 p-4 rounded-full bg-whatsapp text-white shadow-xl hover:bg-green-600 transition duration-300 z-50 text-3xl flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          title="Chatea con nosotros por WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </main>

      <Footer />
    </>
  );
};

export default Products;
