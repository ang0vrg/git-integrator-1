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
