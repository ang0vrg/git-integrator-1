import React, { useState } from "react";
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
import { useCart } from "../context/CartContext";

// Utility function to decode JWT token
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<
    "yape" | "plin" | "paypal" | "card"
  >("yape");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    operationCode: "",
  });

  // PayPal simulation states
  const [paypalPaymentId, setPaypalPaymentId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds


  const getSubtotal = () => {
    return totalPrice;
  };

  const getTotal = () => {
    return totalPrice; // You can add shipping or taxes here if needed
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user ID from JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar el pago");
        navigate("/login");
        return;
      }

      const decodedToken = parseJwt(token);
      const userId = decodedToken?.sub || decodedToken?.userId || decodedToken?.idUser;

      if (!userId) {
        alert("Error al obtener información del usuario");
        return;
      }

      // Prepare cart items for backend
      const cartItems = cart.map(item => ({
        idProduct: item.idProduct,
        quantity: item.quantity,
        price: item.productPrice,
        productName: item.productName
      }));

      const paymentData = {
        monto: getTotal(),
        metodoPago: selectedMethod.toUpperCase(),
        codigoOperacion:
          selectedMethod === "yape" || selectedMethod === "plin"
            ? formData.operationCode
            : null,
        items: cartItems,
        idUsuario: parseInt(userId),
        notasCliente: null,
        dedicatoria: null
      };

      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Payment error:", errorText);
        throw new Error("Error processing payment");
      }

      // Clear cart after successful payment using CartContext
      clearCart();
      
      alert("¡Pago realizado con éxito!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  // PayPal: Initiate payment and get verification code
  const initiatePayPalPayment = async () => {
    setPaypalLoading(true);
    setCodeError("");

    try {
      const res = await fetch("/api/paypal/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          monto: getTotal(),
          descripcion: "Pago de productos",
        }),
      });

      if (!res.ok) throw new Error("Error al iniciar pago PayPal");

      const data = await res.json();
      setPaypalPaymentId(data.paymentId);
      setShowCodeInput(true);
      setTimeRemaining(data.expiresIn || 300);
    } catch (err) {
      console.error(err);
      alert("Error al iniciar el pago con PayPal");
    } finally {
      setPaypalLoading(false);
    }
  };

  // PayPal: Verify code and complete payment
  const verifyPayPalCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setCodeError("Ingresa un código de 6 dígitos");
      return;
    }

    setPaypalLoading(true);
    setCodeError("");

    try {
      // Get user ID from JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar el pago");
        navigate("/login");
        return;
      }

      const decodedToken = parseJwt(token);
      const userId = decodedToken?.sub || decodedToken?.userId || decodedToken?.idUser;

      if (!userId) {
        setCodeError("Error al obtener información del usuario");
        return;
      }

      const verifyRes = await fetch("/api/paypal/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentId: paypalPaymentId,
          verificationCode: verificationCode,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setCodeError(verifyData.message || "Código incorrecto");
        return;
      }

      // Payment verified! Now create payment record with cart items
      const cartItems = cart.map(item => ({
        idProduct: item.idProduct,
        quantity: item.quantity,
        price: item.productPrice,
        productName: item.productName
      }));

      const paymentRecord = {
        monto: getTotal(),
        metodoPago: "PAYPAL",
        codigoOperacion: verifyData.transactionId,
        items: cartItems,
        idUsuario: parseInt(userId),
        notasCliente: null,
        dedicatoria: null
      };

      const paymentRes = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentRecord),
      });

      if (!paymentRes.ok) {
        const errorText = await paymentRes.text();
        console.error("Payment error:", errorText);
        throw new Error("Error al registrar el pago");
      }

      // Success!
      clearCart();
      alert("¡Pago con PayPal realizado con éxito!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setCodeError("Error al procesar el pago");
    } finally {
      setPaypalLoading(false);
    }
  };

  // Countdown timer effect for PayPal code expiration
  React.useEffect(() => {
    if (showCodeInput && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      setCodeError("El código ha expirado");
      setShowCodeInput(false);
      setPaypalPaymentId(null);
    }
  }, [showCodeInput, timeRemaining]);

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };


  if (cart.length === 0) {
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
              {cart.map((item) => (
                <div key={item.idProduct} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    S/ {(item.productPrice * item.quantity).toFixed(2)}
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
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-indigo-600 text-white p-4 rounded-lg text-center">
                      <h3 className="font-bold text-xl flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faPaypal} />
                        PayPal
                      </h3>
                      <p className="text-sm opacity-90 mt-1">
                        Simulación de pago con código de verificación
                      </p>
                    </div>

                    {!showCodeInput ? (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">
                          Haz clic en el botón para generar un código de verificación
                        </p>
                        <button
                          type="button"
                          onClick={initiatePayPalPayment}
                          disabled={paypalLoading}
                          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {paypalLoading ? "Generando..." : `Iniciar Pago - S/ ${getTotal().toFixed(2)}`}
                        </button>
                        <p className="text-xs text-gray-400 mt-3">
                          El código aparecerá en la terminal del servidor
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xl mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-green-800">
                                Código generado exitosamente
                              </p>
                              <p className="text-sm text-green-700 mt-1">
                                Revisa la <strong>terminal del servidor</strong> para ver el código de 6 dígitos
                              </p>
                              <p className="text-xs text-green-600 mt-2">
                                Payment ID: <code className="bg-green-100 px-2 py-0.5 rounded">{paypalPaymentId}</code>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código de Verificación (6 dígitos)
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => {
                              setVerificationCode(e.target.value.replace(/\D/g, ""));
                              setCodeError("");
                            }}
                            className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              codeError ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {codeError && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                              <span>⚠️</span> {codeError}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Tiempo restante:
                          </span>
                          <span className={`font-mono font-semibold ${timeRemaining < 60 ? "text-red-600" : "text-indigo-600"}`}>
                            {formatTime(timeRemaining)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={verifyPayPalCode}
                          disabled={paypalLoading || verificationCode.length !== 6}
                          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {paypalLoading ? "Verificando..." : "Verificar Código"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowCodeInput(false);
                            setPaypalPaymentId(null);
                            setVerificationCode("");
                            setCodeError("");
                          }}
                          className="w-full py-2 text-gray-600 hover:text-gray-800 transition text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
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
