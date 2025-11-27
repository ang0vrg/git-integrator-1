import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import {
  IngredienteDTO,
  RecetaDTO,
  RecetaDetalleDTO,
  ProductoDTO,
} from "../types/AdminTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faSave,
  faUtensils,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<IngredienteDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Recipe State
  const [recipe, setRecipe] = useState<RecetaDTO>({
    nombre: "",
    descripcion: "",
    porciones: 1,
    tiempoPreparacionMin: 30,
    dificultad: "media",
    instrucciones: "",
    detalles: [],
  });

  // Product State
  const [createProduct, setCreateProduct] = useState(false);
  const [product, setProduct] = useState<ProductoDTO>({
    productName: "",
    productPrice: 0,
    categoria: "torta",
    disponibleCatalogo: true,
  });

  // Ingredient Selection State
  const [selectedIngredientId, setSelectedIngredientId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Sync product name with recipe name if creating product
  useEffect(() => {
    if (createProduct) {
      setProduct((prev) => ({ ...prev, productName: recipe.nombre }));
    }
  }, [recipe.nombre, createProduct]);

  const fetchIngredients = async () => {
    try {
      const res = await fetch("/api/ingredientes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIngredients(data);
      }
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    }
  };

  const handleAddIngredient = () => {
    if (!selectedIngredientId || quantity <= 0 || !unit) return;

    const ingredient = ingredients.find(
      (i) => i.idIngrediente === Number(selectedIngredientId)
    );
    if (!ingredient) return;

    const newDetail: RecetaDetalleDTO = {
      idIngrediente: ingredient.idIngrediente!,
      nombreIngrediente: ingredient.nombre,
      cantidad: quantity,
      unidadMedida: unit,
      esOpcional: false,
    };

    setRecipe((prev) => ({
      ...prev,
      detalles: [...prev.detalles, newDetail],
    }));

    // Reset selection
    setSelectedIngredientId("");
    setQuantity(0);
    setUnit("");
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Recipe
      const recipeRes = await fetch("/api/recetas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(recipe),
      });

      if (!recipeRes.ok) throw new Error("Error creating recipe");
      const createdRecipe = await recipeRes.json();

      // 2. Create Product (if selected)
      if (createProduct) {
        const productData: ProductoDTO = {
          ...product,
          idReceta: createdRecipe.idReceta,
          sku: `PROD-${createdRecipe.idReceta}`, // Simple SKU generation
          productDescription: recipe.descripcion,
          porciones: recipe.porciones,
        };

        const productRes = await fetch("/api/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(productData),
        });

        if (!productRes.ok) throw new Error("Error creating product");
      }

      alert("Receta guardada exitosamente!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la receta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Nueva Receta</h1>
          <p className="text-orange-100">
            Crea una nueva receta y agrégala al catálogo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Details */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faUtensils} className="text-orange-500" />
              Detalles de la Receta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={recipe.nombre}
                  onChange={(e) =>
                    setRecipe({ ...recipe, nombre: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dificultad
                </label>
                <select
                  value={recipe.dificultad}
                  onChange={(e) =>
                    setRecipe({ ...recipe, dificultad: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                >
                  <option value="facil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Porciones
                </label>
                <input
                  type="number"
                  min="1"
                  value={recipe.porciones}
                  onChange={(e) =>
                    setRecipe({
                      ...recipe,
                      porciones: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiempo Prep. (min)
                </label>
                <input
                  type="number"
                  min="1"
                  value={recipe.tiempoPreparacionMin}
                  onChange={(e) =>
                    setRecipe({
                      ...recipe,
                      tiempoPreparacionMin: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                rows={3}
                value={recipe.descripcion}
                onChange={(e) =>
                  setRecipe({ ...recipe, descripcion: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instrucciones
              </label>
              <textarea
                rows={5}
                required
                value={recipe.instrucciones}
                onChange={(e) =>
                  setRecipe({ ...recipe, instrucciones: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Ingredientes</h2>

            <div className="flex gap-2 items-end bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Ingrediente
                </label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                >
                  <option value="">Seleccionar...</option>
                  {ingredients.map((ing) => (
                    <option key={ing.idIngrediente} value={ing.idIngrediente}>
                      {ing.nombre} ({ing.unidadMedida})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">
                  Cant.
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">
                  Unidad
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg, g..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2"
                />
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 mb-[1px]"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingrediente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recipe.detalles.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.nombreIngrediente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {detail.cantidad} {detail.unidadMedida}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recipe.detalles.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No hay ingredientes agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Catalog Integration */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faBoxOpen} className="text-purple-500" />
                Catálogo de Productos
              </h2>
              <div className="flex items-center">
                <input
                  id="createProduct"
                  type="checkbox"
                  checked={createProduct}
                  onChange={(e) => setCreateProduct(e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="createProduct"
                  className="ml-2 block text-sm text-gray-900 font-medium"
                >
                  Agregar al Catálogo
                </label>
              </div>
            </div>

            {createProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio de Venta
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required={createProduct}
                    value={product.productPrice}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        productPrice: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    value={product.categoria}
                    onChange={(e) =>
                      setProduct({ ...product, categoria: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                  >
                    <option value="torta">Torta</option>
                    <option value="cupcake">Cupcake</option>
                    <option value="galleta">Galleta</option>
                    <option value="pan">Pan</option>
                    <option value="postre">Postre</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-orange-700 hover:to-pink-700 transition disabled:opacity-50"
            >
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Guardar Receta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
