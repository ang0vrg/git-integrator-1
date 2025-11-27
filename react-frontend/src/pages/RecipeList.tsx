import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { RecetaDTO, ProductoDTO } from "../types/AdminTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBoxOpen,
  faPlus,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function RecipeList() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecetaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecetaDTO | null>(null);
  const [productData, setProductData] = useState<Partial<ProductoDTO>>({
    productPrice: 0,
    categoria: "torta",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recetas", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (recipe: RecetaDTO) => {
    setSelectedRecipe(recipe);
    setProductData({
      productName: recipe.nombre,
      productDescription: recipe.descripcion,
      productPrice: 0,
      categoria: "torta",
      porciones: recipe.porciones,
      disponibleCatalogo: true,
      active: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe) return;

    setCreatingProduct(true);
    try {
      // 1. Create Product
      const newProduct: Partial<ProductoDTO> = {
        ...productData,
        idReceta: selectedRecipe.idReceta,
        sku: `PROD-${selectedRecipe.idReceta}-${Date.now()}`,
      };

      const res = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Error creating product");
      const createdProduct = await res.json();

      // 2. Upload Image (if selected)
      if (imagePreview) {
        const imageRes = await fetch(
          `/api/productos/${createdProduct.idProduct}/image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ image: imagePreview }),
          }
        );
        if (!imageRes.ok) console.error("Error uploading image");
      }

      alert("Producto creado exitosamente!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear el producto");
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Recetas</h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus recetas y crea productos para el catálogo
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/recipes/create")}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nueva Receta
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.idReceta}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {recipe.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        recipe.dificultad === "facil"
                          ? "bg-green-100 text-green-800"
                          : recipe.dificultad === "media"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {recipe.dificultad.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.descripcion}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span>
                      <FontAwesomeIcon icon={faUtensils} className="mr-2" />
                      {recipe.porciones} porciones
                    </span>
                    <span>{recipe.tiempoPreparacionMin} min</span>
                  </div>
                  <button
                    onClick={() => handleOpenModal(recipe)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <FontAwesomeIcon icon={faBoxOpen} />
                    Crear Producto
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Crear Producto */}
        {showModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="bg-purple-600 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold">Crear Producto</h2>
                <p className="text-sm text-purple-100 mt-1">
                  Basado en: {selectedRecipe.nombre}
                </p>
              </div>

              <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    value={productData.productName}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        productName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Venta (S/)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productData.productPrice}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        productPrice: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={productData.categoria}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        categoria: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="torta">Torta</option>
                    <option value="cupcake">Cupcake</option>
                    <option value="galleta">Galleta</option>
                    <option value="pan">Pan</option>
                    <option value="postre">Postre</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen del Producto
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition cursor-pointer relative">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faImage}
                          className="mx-auto h-12 w-12 text-gray-400"
                        />
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                          <span>Subir un archivo</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creatingProduct}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {creatingProduct ? "Creando..." : "Crear Producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
