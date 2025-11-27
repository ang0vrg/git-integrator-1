export interface ProveedorDTO {
  idSupplier?: number;
  supplierName: string;
  businessName?: string;
  ruc?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  district?: string;
  city?: string;
  deliveryTimeDays?: number;
  rating?: number;
  active?: boolean;
}

export interface IngredienteDTO {
  idIngrediente?: number;
  codigoInterno?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  puntoReorden: number;
  costoPromedio: number;
  ultimoCosto?: number;
  precioMinorista?: number;
  precioMayorista?: number;
  precioDistribuidor?: number;
  requiereRefrigeracion?: boolean;
  diasVidaUtil?: number;
  alergeno?: boolean;
  activo?: boolean;
}

export interface ImportResultDTO {
  totalFilas: number;
  ingredientesCreados: number;
  ingredientesActualizados: number;
  preciosCreados: number;
  errores: number;
  mensajesError: string[];
  exitoso: boolean;
}

export interface RecetaDetalleDTO {
  idDetalle?: number;
  idIngrediente: number;
  nombreIngrediente?: string;
  cantidad: number;
  unidadMedida: string;
  esOpcional: boolean;
  notas?: string;
}

export interface RecetaDTO {
  idReceta?: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  porciones: number;
  tiempoPreparacionMin: number;
  dificultad: string;
  costoIngredientes?: number;
  costoManoObra?: number;
  costoTotal?: number;
  instrucciones: string;
  notasAlergenos?: string;
  activa?: boolean;
  detalles: RecetaDetalleDTO[];
}

export interface ProductoDTO {
  idProduct?: number;
  idReceta?: number;
  sku?: string;
  productName: string;
  productDescription?: string;
  categoria: string;
  costoProduccion?: number;
  margenGanancia?: number;
  productPrice: number;
  pesoGramos?: number;
  porciones?: number;
  requiereRefrigeracion?: boolean;
  diasVidaUtil?: number;
  disponibleCatalogo?: boolean;
  requierePedidoAnticipado?: boolean;
  diasAnticipacion?: number;
  stockDisponible?: number;
  productImage?: string;
  etiquetas?: string;
  ordenVisualizacion?: number;
  destacado?: boolean;
  active?: boolean;
}
