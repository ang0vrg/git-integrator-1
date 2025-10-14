import { useState } from "react";
import "../assets/css/PersonalizarPedido.css";



function PersonalizarPedido() {
  const [formulario, setFormulario] = useState({
    tamano: "16cm",
    pisos: 1,
    sabor: "Chocolate",
    decoracion: "Fresas", 
    mensajeTorta: "Feliz cumpleaños, Sofía",
    fechaEntrega: "",
    metodoEntrega: "Envío a domicilio",
    comentarioAdicional: "La torta no tanto chantilly...",
  });

  // Función de utilidad para manejar la selección de botones
  const handleOptionChange = (name, value) => {
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  // Función de utilidad para manejar cambios en inputs/textareas/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prevFormulario) => ({ ...prevFormulario, [name]: value }));
  };

  const handleSubmit = async () => {
    
    try {
      const response = await fetch("http://localhost:8080/personalizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });
      const data = await response.json();
      alert("🎉 Pedido enviado con éxito");
      console.log(data);
    } catch (error) {
      alert("❌ Error al enviar pedido");
      console.error(error);
    }
  };

  return (
    <div className="personalizar-pagina">
      <div className="personalizar-banner">
        <h1 className="banner-titulo-flotante">Personaliza<br />tu pedido</h1>
      </div>

    <div className="personalizar-contenedor">

        
        <div className="personalizar-cuerpo">
          {/* Columna de la Imagen */}
          <div className="imagen-preview">
            <img src="/src/assets/images/imgPersonalizar/pastel.jpg" alt="Torta"/>
          </div>

          {/* Columna de las Opciones (Botones) */}
          <div className="opciones-selector">
            
            {/* Tamaño */}
            <div className="opcion-grupo">
              <label className="opcion-label">Tamaño</label>
              <div className="botones-fila">
                {["16cm", "22cm", "26cm", "30cm"].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleOptionChange("tamano", t)}
                    className={formulario.tamano === t ? "activo" : ""}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Pisos */}
            <div className="opcion-grupo">
              <label className="opcion-label">Pisos</label>
              <div className="botones-fila">
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleOptionChange("pisos", p)}
                    className={formulario.pisos === p ? "activo" : ""}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Sabor */}
            <div className="opcion-grupo">
              <label className="opcion-label">Sabor</label>
              <div className="botones-fila">
                {["Chocolate", "Vainilla", "Fresa", "Tres Leches", "Red Velvet", "Personalizado"].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => handleOptionChange("sabor", s)}
                      className={formulario.sabor === s ? "activo" : ""}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Decoración */}
            <div className="opcion-grupo">
              <label className="opcion-label">Decoración</label>
              <div className="botones-fila">
                {["Fresas", "Mango", "Tres Leches", "Red Velvet"].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleOptionChange("decoracion", d)}
                    className={formulario.decoracion === d ? "activo" : ""}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Campos de Comentarios y Envío */}
        <div className="campos-comentarios">
          {/* Mensaje en la Torta */}
          <label className="campo-label">Mensaje en la torta</label>
          <input
            type="text"
            name="mensajeTorta"
            value={formulario.mensajeTorta}
            onChange={handleChange}
            placeholder="Feliz cumpleaños, Sofía"
            className="input-text"
          />

          {/* Fecha de Entrega */}
          <label className="campo-label">Fecha de entrega</label>
          <input
            type="date"
            name="fechaEntrega"
            value={formulario.fechaEntrega}
            onChange={handleChange}
            className="input-fecha"
          />

          {/* Método de Entrega */}
          <label className="campo-label">Método de entrega</label>
          <select
            name="metodoEntrega"
            value={formulario.metodoEntrega}
            onChange={handleChange}
            className="input-select"
          >
            <option value="Envío a domicilio">Envío a domicilio</option>
            <option value="Recoger en tienda">Recoger en tienda</option>
          </select>

          {/* Comentario Adicional */}
          <label className="campo-label">Comentario adicional</label>
          <textarea
            name="comentarioAdicional"
            value={formulario.comentarioAdicional}
            onChange={handleChange}
            placeholder="La torta no tanto chantilly..."
            className="input-textarea"
          />

          {/* Botón Agregar al Carrito */}
          <button className="btn-agregar" onClick={handleSubmit}>
            Agregar al carrito
          </button>
        </div>

      </div>
    </div>
  );
}

export default PersonalizarPedido;