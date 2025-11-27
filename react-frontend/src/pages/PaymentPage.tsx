import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMobileAlt,
  faCheckCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

interface Product {
  idProduct: number;
  productName: string;
  productPrice: number;
  productImage: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<
    "yape" | "plin" | "paypal" | "card"
  >("yape");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    operationCode: "",
  });

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    const savedProducts = localStorage.getItem('products');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const getCartItems = () => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = products.find(p => p.idProduct === Number(id));
      return { product, quantity: qty };
    }).filter(item => item.product);
  };

  const getSubtotal = () => {
    return getCartItems().reduce((sum, item) => 
      sum + (item.product!.productPrice * item.quantity), 0
    );
  };

  const getTotal = () => {
    return getSubtotal(); // You can add shipping or taxes here if needed
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        monto: getTotal(),
        metodoPago: selectedMethod.toUpperCase(),
        codigoOperacion:
          selectedMethod === "yape" || selectedMethod === "plin"
            ? formData.operationCode
            : null,
      };

      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!res.ok) throw new Error("Error processing payment");

      // Clear cart after successful payment
      localStorage.removeItem('cart');
      localStorage.removeItem('products');
      
      alert("¡Pago realizado con éxito!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <FontAwesomeIcon icon={faShoppingCart} className="text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">Agrega productos antes de proceder al pago</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
          >
            Ver Productos
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Pasarela de Pagos</h1>
          <p className="text-green-100">
            Revisa tu pedido y selecciona tu método de pago
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingCart} className="text-pink-600" />
              Resumen del Pedido
            </h3>
            
            <div className="space-y-3 mb-4">
              {cartItems.map(({ product, quantity }) => (
                <div key={product!.idProduct} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product!.productName}</p>
                    <p className="text-gray-500">Cantidad: {quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    S/ {(product!.productPrice * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">S/ {getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span className="text-pink-600">S/ {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods and Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods Selector */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-700 mb-4">
                Métodos de Pago
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedMethod("yape")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedMethod === "yape"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-transparent"
                  }`}
                >
                  <FontAwesomeIcon icon={faMobileAlt} className="text-2xl" />
                  <span className="font-medium text-sm">Yape</span>
                </button>
                <button
                  onClick={() => setSelectedMethod("plin")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedMethod === "plin"
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-transparent"
                  }`}
                >
                  <FontAwesomeIcon icon={faMobileAlt} className="text-2xl" />
                  <span className="font-medium text-sm">Plin</span>
                </button>
                <button
                  onClick={() => setSelectedMethod("paypal")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedMethod === "paypal"
                      ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-transparent"
                  }`}
                >
                  <FontAwesomeIcon icon={faPaypal} className="text-2xl" />
                  <span className="font-medium text-sm">PayPal</span>
                </button>
                <button
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedMethod === "card"
                      ? "bg-orange-100 text-orange-700 border-2 border-orange-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-transparent"
                  }`}
                >
                  <FontAwesomeIcon icon={faCreditCard} className="text-2xl" />
                  <span className="font-medium text-sm">Tarjeta</span>
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <form onSubmit={handlePayment} className="space-y-6">
                {selectedMethod === "yape" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-purple-600 text-white p-4 rounded-lg text-center">
                      <h3 className="font-bold text-xl">Yape</h3>
                      <p className="text-sm opacity-90">Escanea el QR para pagar</p>
                    </div>
                    <div className="flex justify-center py-4">
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400">
                        <span className="text-gray-500">QR Code</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código de Operación
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ingrese el código de confirmación"
                        value={formData.operationCode}
                        onChange={(e) =>
                          setFormData({ ...formData, operationCode: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-3"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "plin" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                      <h3 className="font-bold text-xl">Plin</h3>
                      <p className="text-sm opacity-90">Escanea el QR para pagar</p>
                    </div>
                    <div className="flex justify-center py-4">
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400">
                        <span className="text-gray-500">QR Code</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código de Operación
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ingrese el código de confirmación"
                        value={formData.operationCode}
                        onChange={(e) =>
                          setFormData({ ...formData, operationCode: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "paypal" && (
                  <div className="space-y-6 animate-fadeIn text-center py-8">
                    <FontAwesomeIcon
                      icon={faPaypal}
                      className="text-6xl text-indigo-600"
                    />
                    <p className="text-gray-600">
                      Serás redirigido a PayPal para completar tu pago de forma
                      segura.
                    </p>
                    <p className="text-xs text-gray-400">
                      * Simulación: Al confirmar el pago se registrará como exitoso.
                    </p>
                  </div>
                )}

                {selectedMethod === "card" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Credit Card Preview */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 rounded-2xl shadow-2xl mb-6 aspect-[1.586/1] max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
                        {/* Card Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="relative h-full flex flex-col justify-between">
                          {/* Top Section */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {/* Chip */}
                              <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                                <div className="w-8 h-6 border-2 border-yellow-800 rounded-sm"></div>
                              </div>
                              {/* Contactless */}
                              <div className="flex gap-0.5">
                                <div className="w-3 h-4 border-2 border-white rounded-full opacity-60"></div>
                                <div className="w-3 h-4 border-2 border-white rounded-full opacity-60 -ml-2"></div>
                                <div className="w-3 h-4 border-2 border-white rounded-full opacity-60 -ml-2"></div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-70">BANK</div>
                              <div className="text-sm font-bold">VISA</div>
                            </div>
                          </div>

                          {/* Card Number */}
                          <div className="text-2xl font-mono tracking-wider text-center my-4">
                            {formData.cardNumber 
                              ? formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                              : "•••• •••• •••• ••••"}
                          </div>

                          {/* Bottom Section */}
                          <div className="flex justify-between items-end text-sm">
                            <div>
                              <div className="text-xs opacity-70 mb-1">TITULAR</div>
                              <div className="font-semibold tracking-wide">NOMBRE APELLIDO</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-70 mb-1">VÁLIDO HASTA</div>
                              <div className="font-semibold">{formData.expiry || "MM/YY"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Form */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                          setFormData({ ...formData, cardNumber: formatted });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          value={formData.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setFormData({ ...formData, expiry: value });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      "Procesando..."
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Confirmar Pago - S/ {getTotal().toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
