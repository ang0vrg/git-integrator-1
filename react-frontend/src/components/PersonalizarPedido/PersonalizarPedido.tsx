import React, { useState } from "react";

interface Formulario {
  tamano: string;
  pisos: number;
  sabor: string;
  decoracion: string;
  mensajeTorta: string;
  fechaEntrega: string;
  metodoEntrega: string;
  comentarioAdicional: string;
}

const PersonalizarPedido: React.FC = () => {
  const [formulario, setFormulario] = useState<Formulario>({
    tamano: "16cm",
    pisos: 1,
    sabor: "Chocolate",
    decoracion: "Fresas",
    mensajeTorta: "Feliz cumpleaños, Sofía",
    fechaEntrega: "",
    metodoEntrega: "Recoger en tienda",
    comentarioAdicional: "La torta no tanto chantilly...",
  });

  const handleOptionChange = (name: keyof Formulario, value: string | number) => {
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/personalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });
      if (!response.ok) throw new Error("Error en el servidor");
      alert("🎉 Pedido enviado con éxito");
    } catch (error) {
      alert("❌ Error al enviar pedido");
      console.error(error);
    }
  };

  return (
    <div className="bg-[#f5f5f5] text-[#333] min-h-screen block px-5 py-10">
      {/* Banner */}
      <div
        className="relative w-full h-[350px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/Img/Personalizar/banner.jpg')" }}
      >
        <h1 className="absolute top-1/2 left-[8%] -translate-y-1/2 text-white text-[5vw] font-bold leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,.8)] m-0 p-0">
          Personaliza<br />tu pedido
        </h1>
      </div>

      <div className="max-w-[1200px] w-full mx-auto my-10 px-10">
        {/* Cuerpo: imagen + opciones */}
      <div className="flex flex-row gap-10 items-center mb-10">
        {/* Imagen */}
        <div className="shrink-0 w-[350px]">
          <img
            src="/src/assets/Img/Personalizar/pastel.png"
            alt="Torta"
            className="w-full h-auto block rounded-lg shadow-md"
          />
        </div>

        {/* Opciones (botones) */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Tamaño */}
          <div>
            <label className="block text-[14px] text-[#666] font-bold uppercase tracking-wide mb-2">Tamaño</label>
            <div className="flex flex-wrap gap-2">
              {["16cm", "22cm", "26cm", "30cm"].map((o) => (
                <button
                  key={o}
                  onClick={() => handleOptionChange("tamano", o)}
                  className={`px-[15px] py-2 text-[14px] border rounded transition ${
                    formulario.tamano === o
                      ? "bg-[#c44c47] text-white border-[#c44c47] font-bold"
                      : "bg-[#eee] text-[#333] border-[#ccc] hover:bg-[#e0e0e0]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Pisos */}
          <div>
            <label className="block text-[14px] text-[#666] font-bold uppercase tracking-wide mb-2">Pisos</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((o) => (
                <button
                  key={o}
                  onClick={() => handleOptionChange("pisos", o)}
                  className={`px-[15px] py-2 text-[14px] border rounded transition ${
                    formulario.pisos === o
                      ? "bg-[#c44c47] text-white border-[#c44c47] font-bold"
                      : "bg-[#eee] text-[#333] border-[#ccc] hover:bg-[#e0e0e0]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Sabor */}
          <div>
            <label className="block text-[14px] text-[#666] font-bold uppercase tracking-wide mb-2">Sabor</label>
            <div className="flex flex-wrap gap-2">
              {["Chocolate", "Vainilla", "Fresa", "Tres Leches", "Red Velvet", "Personalizado"].map((o) => (
                <button
                  key={o}
                  onClick={() => handleOptionChange("sabor", o)}
                  className={`px-[15px] py-2 text-[14px] border rounded transition ${
                    formulario.sabor === o
                      ? "bg-[#c44c47] text-white border-[#c44c47] font-bold"
                      : "bg-[#eee] text-[#333] border-[#ccc] hover:bg-[#e0e0e0]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Decoración */}
          <div>
            <label className="block text-[14px] text-[#666] font-bold uppercase tracking-wide mb-2">Decoración</label>
            <div className="flex flex-wrap gap-2">
              {["Fresas", "Mango", "Tres Leches", "Red Velvet"].map((o) => (
                <button
                  key={o}
                  onClick={() => handleOptionChange("decoracion", o)}
                  className={`px-[15px] py-2 text-[14px] border rounded transition ${
                    formulario.decoracion === o
                      ? "bg-[#c44c47] text-white border-[#c44c47] font-bold"
                      : "bg-[#eee] text-[#333] border-[#ccc] hover:bg-[#e0e0e0]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Formulario final */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] text-[#666] font-bold mb-1">Mensaje en la torta</label>
            <input
              type="text"
              name="mensajeTorta"
              value={formulario.mensajeTorta}
              onChange={handleChange}
              placeholder="Feliz cumpleaños, Sofía"
              className="w-full px-4 py-3 rounded border border-[#ccc] bg-white text-[#333] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c44c47]"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#666] font-bold mb-1">Fecha de entrega</label>
            <input
              type="date"
              name="fechaEntrega"
              value={formulario.fechaEntrega}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-[#ccc] bg-white text-[#333] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c44c47]"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#666] font-bold mb-1">Método de entrega</label>
            <select
              name="metodoEntrega"
              value={formulario.metodoEntrega}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-[#ccc] bg-white text-[#333] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c44c47]"
            >
              <option>Envío a domicilio</option>
              <option>Recoger en tienda</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[14px] text-[#666] font-bold mb-1">Comentario adicional</label>
            <textarea
              name="comentarioAdicional"
              value={formulario.comentarioAdicional}
              onChange={handleChange}
              placeholder="La torta no tanto chantilly..."
              rows={4}
              className="w-full px-4 py-3 rounded border border-[#ccc] bg-white text-[#333] shadow-inner resize-vertical focus:outline-none focus:ring-2 focus:ring-[#c44c47]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-[#c44c47] hover:bg-[#a83f3a] text-white font-bold py-4 rounded transition"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizarPedido;