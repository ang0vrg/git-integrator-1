package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Ingrediente;
import Integrador.Pasteleria.entity.Proveedor;
import Integrador.Pasteleria.entity.PrecioProveedorIngrediente;
import Integrador.Pasteleria.entity.Importacion;
import Integrador.Pasteleria.entity.DetalleImportacion;
import Integrador.Pasteleria.repository.ImportacionRepository;
import Integrador.Pasteleria.dto.ImportResultDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import io.quarkus.logging.Log;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class IngredienteImportService {

    @Inject
    EntityManager em;

    /**
     * Importa ingredientes desde un archivo Excel
     * Formato esperado:
     * | Código | Nombre | Unidad | Categoría | Precio Minorista | Precio Mayorista
     * | Precio
     * Distribuidor | Stock Inicial | Stock Mínimo | Stock Máximo | Punto Reorden |
     * Refrigeración | Vida Útil | Alergeno |
     */
    @Inject
    ImportacionRepository importacionRepository;

    @Transactional
    public ImportResultDTO importFromExcel(InputStream inputStream, Integer idProveedor) {
        ImportResultDTO result = new ImportResultDTO();
        result.setTotalFilas(0);
        result.setIngredientesCreados(0);
        result.setIngredientesActualizados(0);
        result.setPreciosCreados(0);
        result.setErrores(0);
        result.setMensajesError(new ArrayList<>());

        try {
            Proveedor proveedor = em.find(Proveedor.class, idProveedor);
            if (proveedor == null) {
                result.setExitoso(false);
                result.getMensajesError().add("Proveedor no encontrado con ID: " + idProveedor);
                return result;
            }

            // Crear registro de importación
            Importacion importacion = new Importacion();
            importacion.setProveedor(proveedor);
            importacion.setObservaciones("Importación Excel");
            importacionRepository.persist(importacion);

            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            int rowNum = 0;
            for (Row row : sheet) {
                if (rowNum == 0) {
                    rowNum++;
                    continue;
                }

                try {
                    result.setTotalFilas(result.getTotalFilas() + 1);

                    String codigo = getCellValueAsString(row.getCell(0));
                    String nombre = getCellValueAsString(row.getCell(1));
                    String unidad = getCellValueAsString(row.getCell(2));
                    String categoriaStr = getCellValueAsString(row.getCell(3));
                    BigDecimal costoUnitario = getCellValueAsBigDecimal(row.getCell(4));
                    BigDecimal precioMinorista = getCellValueAsBigDecimal(row.getCell(5));
                    BigDecimal precioMayorista = getCellValueAsBigDecimal(row.getCell(6));
                    BigDecimal precioDistribuidor = getCellValueAsBigDecimal(row.getCell(7));
                    BigDecimal stockInicial = getCellValueAsBigDecimal(row.getCell(8));
                    BigDecimal stockMinimo = getCellValueAsBigDecimal(row.getCell(9));
                    BigDecimal stockMaximo = getCellValueAsBigDecimal(row.getCell(10));
                    BigDecimal puntoReorden = getCellValueAsBigDecimal(row.getCell(11));
                    Boolean refrigeracion = getCellValueAsBoolean(row.getCell(12));
                    Integer vidaUtil = getCellValueAsInteger(row.getCell(13));
                    Boolean alergeno = getCellValueAsBoolean(row.getCell(14));

                    if (nombre == null || nombre.trim().isEmpty()) {
                        result.setErrores(result.getErrores() + 1);
                        result.getMensajesError().add("Fila " + (rowNum + 1) + ": Nombre es obligatorio");
                        rowNum++;
                        continue;
                    }

                    if (unidad == null || unidad.trim().isEmpty()) {
                        result.setErrores(result.getErrores() + 1);
                        result.getMensajesError().add("Fila " + (rowNum + 1) + ": Unidad es obligatoria");
                        rowNum++;
                        continue;
                    }

                    Ingrediente ingrediente = findOrCreateIngrediente(codigo, nombre, unidad, categoriaStr,
                            stockInicial, stockMinimo, stockMaximo, puntoReorden, refrigeracion, vidaUtil, alergeno,
                            result);

                    // Actualizar precios en Ingrediente
                    if (precioMinorista != null)
                        ingrediente.setPrecioMinorista(precioMinorista);
                    if (precioMayorista != null)
                        ingrediente.setPrecioMayorista(precioMayorista);
                    if (precioDistribuidor != null)
                        ingrediente.setPrecioDistribuidor(precioDistribuidor);
                    em.merge(ingrediente);

                    // Crear detalle de importación
                    DetalleImportacion detalle = new DetalleImportacion();
                    detalle.setImportacion(importacion);
                    detalle.setIngrediente(ingrediente);
                    detalle.setCantidad(stockInicial != null ? stockInicial : BigDecimal.ZERO);
                    // Usamos costo unitario si existe, sino precio mayorista o minorista como
                    // fallback
                    BigDecimal costo = costoUnitario;
                    if (costo == null) {
                        costo = precioMayorista != null ? precioMayorista : precioMinorista;
                    }
                    detalle.setPrecioUnitario(costo);
                    em.persist(detalle);

                    // Mantener lógica de precios por proveedor (opcional, pero bueno tener
                    // histórico)
                    if (precioMinorista != null && precioMinorista.compareTo(BigDecimal.ZERO) > 0) {
                        createOrUpdatePrecio(proveedor, ingrediente,
                                PrecioProveedorIngrediente.TipoCliente.minorista, precioMinorista, result);
                    }
                    if (precioMayorista != null && precioMayorista.compareTo(BigDecimal.ZERO) > 0) {
                        createOrUpdatePrecio(proveedor, ingrediente,
                                PrecioProveedorIngrediente.TipoCliente.mayorista, precioMayorista, result);
                    }
                    if (precioDistribuidor != null && precioDistribuidor.compareTo(BigDecimal.ZERO) > 0) {
                        createOrUpdatePrecio(proveedor, ingrediente,
                                PrecioProveedorIngrediente.TipoCliente.distribuidor, precioDistribuidor, result);
                    }

                } catch (Exception e) {
                    result.setErrores(result.getErrores() + 1);
                    result.getMensajesError().add("Fila " + (rowNum + 1) + ": " + e.getMessage());
                    Log.error("Error procesando fila " + (rowNum + 1), e);
                }
                rowNum++;
            }
            workbook.close();
            result.setExitoso(result.getErrores() == 0);

        } catch (Exception e) {
            result.setExitoso(false);
            result.getMensajesError().add("Error general: " + e.getMessage());
            Log.error("Error importando Excel", e);
        }
        return result;
    }

    @Transactional
    public ImportResultDTO importFromCsv(InputStream inputStream, Integer idProveedor) {
        ImportResultDTO result = new ImportResultDTO();
        result.setTotalFilas(0);
        result.setIngredientesCreados(0);
        result.setIngredientesActualizados(0);
        result.setPreciosCreados(0);
        result.setErrores(0);
        result.setMensajesError(new ArrayList<>());

        try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream))) {
            Proveedor proveedor = em.find(Proveedor.class, idProveedor);
            if (proveedor == null) {
                result.setExitoso(false);
                result.getMensajesError().add("Proveedor no encontrado con ID: " + idProveedor);
                return result;
            }

            // Crear registro de importación
            Importacion importacion = new Importacion();
            importacion.setProveedor(proveedor);
            importacion.setObservaciones("Importación CSV");
            importacionRepository.persist(importacion);

            String line;
            int rowNum = 0;
            while ((line = br.readLine()) != null) {
                if (rowNum == 0) {
                    rowNum++;
                    continue;
                }

                try {
                    result.setTotalFilas(result.getTotalFilas() + 1);

                    // Detectar delimitador (preferir ; si existe, común en español)
                    String delimiter = line.contains(";") ? ";" : ",";
                    String[] values = line.split(delimiter);

                    if (values.length < 3) {
                        result.setErrores(result.getErrores() + 1);
                        result.getMensajesError()
                                .add("Fila " + (rowNum + 1)
                                        + ": Formato inválido (se esperaban al menos 3 columnas, encontradas "
                                        + values.length + ")");
                        Log.warn("Fila " + (rowNum + 1) + " inválida: " + line);
                        rowNum++;
                        continue;
                    }

                    String codigo = values[0].trim();
                    String nombre = values[1].trim();
                    String unidad = values[2].trim();
                    String categoriaStr = values.length > 3 ? values[3].trim() : null;
                    BigDecimal costoUnitario = parseDecimal(values.length > 4 ? values[4] : null);
                    BigDecimal precioMinorista = parseDecimal(values.length > 5 ? values[5] : null);
                    BigDecimal precioMayorista = parseDecimal(values.length > 6 ? values[6] : null);
                    BigDecimal precioDistribuidor = parseDecimal(values.length > 7 ? values[7] : null);
                    BigDecimal stockInicial = parseDecimal(values.length > 8 ? values[8] : null);
                    BigDecimal stockMinimo = parseDecimal(values.length > 9 ? values[9] : null);
                    BigDecimal stockMaximo = parseDecimal(values.length > 10 ? values[10] : null);
                    BigDecimal puntoReorden = parseDecimal(values.length > 11 ? values[11] : null);
                    Boolean refrigeracion = parseBoolean(values.length > 12 ? values[12] : null);
                    Integer vidaUtil = parseInteger(values.length > 13 ? values[13] : null);
                    Boolean alergeno = parseBoolean(values.length > 14 ? values[14] : null);

                    if (nombre.isEmpty()) {
                        result.setErrores(result.getErrores() + 1);
                        result.getMensajesError().add("Fila " + (rowNum + 1) + ": Nombre es obligatorio");
                        rowNum++;
                        continue;
                    }

                    if (unidad.isEmpty()) {
                        result.setErrores(result.getErrores() + 1);
                        result.getMensajesError().add("Fila " + (rowNum + 1) + ": Unidad es obligatoria");
                        rowNum++;
                        continue;
                    }

                    Ingrediente ingrediente = findOrCreateIngrediente(codigo, nombre, unidad, categoriaStr,
                            stockInicial, stockMinimo, stockMaximo, puntoReorden, refrigeracion, vidaUtil, alergeno,
                            result);

                    // Actualizar precios en Ingrediente
                    if (precioMinorista != null)
                        ingrediente.setPrecioMinorista(precioMinorista);
                    if (precioMayorista != null)
                        ingrediente.setPrecioMayorista(precioMayorista);
                    if (precioDistribuidor != null)
                        ingrediente.setPrecioDistribuidor(precioDistribuidor);
                    em.merge(ingrediente);

                    // Crear detalle de importación
                    DetalleImportacion detalle = new DetalleImportacion();
                    detalle.setImportacion(importacion);
                    detalle.setIngrediente(ingrediente);
                    detalle.setCantidad(stockInicial != null ? stockInicial : BigDecimal.ZERO);

                    BigDecimal costo = costoUnitario;
                    if (costo == null) {
                        costo = precioMayorista != null ? precioMayorista : precioMinorista;
                    }
                    detalle.setPrecioUnitario(costo);
                    em.persist(detalle);

                    if (precioMinorista != null && precioMinorista.compareTo(BigDecimal.ZERO) > 0) {
                        createOrUpdatePrecio(proveedor, ingrediente,
                                PrecioProveedorIngrediente.TipoCliente.minorista, precioMinorista, result);
                    }
                    if (precioMayorista != null && precioMayorista.compareTo(BigDecimal.ZERO) > 0) {
                        createOrUpdatePrecio(proveedor, ingrediente,
                                PrecioProveedorIngrediente.TipoCliente.mayorista, precioMayorista, result);
                    }
                    if (precioDistribuidor != null && precioDistribuidor.compareTo(BigDecimal.ZERO) > 0) {
                        createOrUpdatePrecio(proveedor, ingrediente,
                                PrecioProveedorIngrediente.TipoCliente.distribuidor, precioDistribuidor, result);
                    }

                } catch (Exception e) {
                    result.setErrores(result.getErrores() + 1);
                    result.getMensajesError().add("Fila " + (rowNum + 1) + ": " + e.getMessage());
                    Log.error("Error procesando fila CSV " + (rowNum + 1), e);
                }
                rowNum++;
            }
            result.setExitoso(result.getErrores() == 0);

        } catch (Exception e) {
            result.setExitoso(false);
            result.getMensajesError().add("Error general CSV: " + e.getMessage());
            Log.error("Error importando CSV", e);
        }
        return result;
    }

    private BigDecimal parseDecimal(String value) {
        if (value == null || value.trim().isEmpty())
            return null;
        try {
            // Limpiar comillas, espacios y símbolos de moneda
            String cleaned = value.trim()
                    .replace("\"", "")
                    .replace("S/", "")
                    .replace("$", "")
                    .trim();

            // Si tiene coma y punto, asumir que la coma es miles si está antes del punto
            // (ej: 1,000.00)
            // O que la coma es decimal si no hay punto (ej: 10,50)
            if (cleaned.contains(",") && !cleaned.contains(".")) {
                cleaned = cleaned.replace(",", ".");
            } else if (cleaned.contains(",") && cleaned.contains(".")) {
                // Eliminar coma de miles
                cleaned = cleaned.replace(",", "");
            }

            return new BigDecimal(cleaned);
        } catch (Exception e) {
            Log.warn("Error parsing decimal value: '" + value + "' - " + e.getMessage());
            return null;
        }
    }

    private Ingrediente findOrCreateIngrediente(String codigo, String nombre, String unidad, String categoriaStr,
            BigDecimal stockInicial, BigDecimal stockMinimo, BigDecimal stockMaximo, BigDecimal puntoReorden,
            Boolean refrigeracion, Integer vidaUtil, Boolean alergeno, ImportResultDTO result) {
        Ingrediente ingrediente = null;

        if (codigo != null && !codigo.trim().isEmpty()) {
            List<Ingrediente> found = em.createQuery(
                    "SELECT i FROM Ingrediente i WHERE i.codigoInterno = :codigo", Ingrediente.class)
                    .setParameter("codigo", codigo.trim())
                    .getResultList();
            if (!found.isEmpty()) {
                ingrediente = found.get(0);
            }
        }

        if (ingrediente == null) {
            List<Ingrediente> found = em.createQuery(
                    "SELECT i FROM Ingrediente i WHERE i.nombre = :nombre", Ingrediente.class)
                    .setParameter("nombre", nombre.trim())
                    .getResultList();
            if (!found.isEmpty()) {
                ingrediente = found.get(0);
            }
        }

        if (ingrediente == null) {
            ingrediente = new Ingrediente();
            ingrediente.setCodigoInterno(codigo != null ? codigo.trim() : null);
            ingrediente.setNombre(nombre.trim());
            ingrediente.setUnidadMedida(unidad.trim());

            // Set category
            if (categoriaStr != null && !categoriaStr.trim().isEmpty()) {
                try {
                    ingrediente.setCategoria(Ingrediente.Categoria.valueOf(categoriaStr.trim().toLowerCase()));
                } catch (IllegalArgumentException e) {
                    ingrediente.setCategoria(Ingrediente.Categoria.otro);
                    Log.warn("Categoría inválida: " + categoriaStr + ", asignando 'otro'");
                }
            } else {
                ingrediente.setCategoria(Ingrediente.Categoria.otro);
            }

            ingrediente.setStockActual(stockInicial != null ? stockInicial : BigDecimal.ZERO);
            ingrediente.setStockMinimo(stockMinimo != null ? stockMinimo : BigDecimal.ZERO);
            ingrediente.setStockMaximo(stockMaximo);
            ingrediente.setPuntoReorden(puntoReorden != null ? puntoReorden : BigDecimal.ZERO);
            ingrediente.setRequiereRefrigeracion(refrigeracion != null ? refrigeracion : false);
            ingrediente.setDiasVidaUtil(vidaUtil);
            ingrediente.setAlergeno(alergeno != null ? alergeno : false);
            ingrediente.setActivo(true);
            em.persist(ingrediente);
            result.setIngredientesCreados(result.getIngredientesCreados() + 1);
            Log.info("Ingrediente creado: " + nombre);
        } else {
            // Si el ingrediente existe (incluso si estaba inactivo), lo reactivamos
            ingrediente.setActivo(true);

            if (stockInicial != null && stockInicial.compareTo(BigDecimal.ZERO) > 0) {
                ingrediente.setStockActual(ingrediente.getStockActual().add(stockInicial));
            }
            em.merge(ingrediente);

            result.setIngredientesActualizados(result.getIngredientesActualizados() + 1);
            Log.info("Ingrediente actualizado: " + nombre);
        }

        return ingrediente;
    }

    private void createOrUpdatePrecio(Proveedor proveedor, Ingrediente ingrediente,
            PrecioProveedorIngrediente.TipoCliente tipoCliente,
            BigDecimal precio, ImportResultDTO result) {
        List<PrecioProveedorIngrediente> preciosExistentes = em.createQuery(
                "SELECT p FROM PrecioProveedorIngrediente p " +
                        "WHERE p.proveedor.idSupplier = :idProveedor " +
                        "AND p.ingrediente.idIngrediente = :idIngrediente " +
                        "AND p.tipoCliente = :tipoCliente",
                PrecioProveedorIngrediente.class)
                .setParameter("idProveedor", proveedor.getIdSupplier())
                .setParameter("idIngrediente", ingrediente.getIdIngrediente())
                .setParameter("tipoCliente", tipoCliente)
                .getResultList();

        if (preciosExistentes.isEmpty()) {
            PrecioProveedorIngrediente nuevoPrecio = new PrecioProveedorIngrediente();
            nuevoPrecio.setProveedor(proveedor);
            nuevoPrecio.setIngrediente(ingrediente);
            nuevoPrecio.setTipoCliente(tipoCliente);
            nuevoPrecio.setPrecioUnitario(precio);
            nuevoPrecio.setCantidadMinima(BigDecimal.ONE);
            nuevoPrecio.setMoneda("PEN");
            nuevoPrecio.setActivo(true);
            em.persist(nuevoPrecio);
            result.setPreciosCreados(result.getPreciosCreados() + 1);
        } else {
            PrecioProveedorIngrediente precioExistente = preciosExistentes.get(0);
            precioExistente.setPrecioUnitario(precio);
            precioExistente.setActivo(true);
            em.merge(precioExistente);

        }

    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null)
            return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    private Boolean getCellValueAsBoolean(Cell cell) {
        if (cell == null)
            return null;
        try {
            if (cell.getCellType() == CellType.BOOLEAN) {
                return cell.getBooleanCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                String val = cell.getStringCellValue().trim().toLowerCase();
                return val.equals("si") || val.equals("sí") || val.equals("true") || val.equals("verdadero")
                        || val.equals("yes");
            }
        } catch (Exception e) {
            Log.warn("Error parsing boolean: " + e.getMessage());
        }
        return null;
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null)
            return null;
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                String val = cell.getStringCellValue().trim();
                if (val.isEmpty())
                    return null;
                return Integer.parseInt(val);
            }
        } catch (Exception e) {
            Log.warn("Error parsing integer: " + e.getMessage());
        }
        return null;
    }

    private Boolean parseBoolean(String value) {
        if (value == null || value.trim().isEmpty())
            return null;
        String val = value.trim().toLowerCase();
        return val.equals("si") || val.equals("sí") || val.equals("true") || val.equals("verdadero")
                || val.equals("yes");
    }

    private Integer parseInteger(String value) {
        if (value == null || value.trim().isEmpty())
            return null;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null)
            return null;

        try {
            switch (cell.getCellType()) {
                case NUMERIC:
                    return BigDecimal.valueOf(cell.getNumericCellValue());
                case STRING:
                    String value = cell.getStringCellValue().trim();
                    if (value.isEmpty())
                        return null;
                    return new BigDecimal(value);
                default:
                    return null;
            }
        } catch (Exception e) {
            Log.warn("Error convirtiendo celda a BigDecimal: " + e.getMessage());
            return null;
        }
    }
}
