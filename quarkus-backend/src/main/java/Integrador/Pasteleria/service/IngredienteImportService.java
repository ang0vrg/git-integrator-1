package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Ingrediente;
import Integrador.Pasteleria.entity.Proveedor;
import Integrador.Pasteleria.entity.PrecioProveedorIngrediente;
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
     * | Código | Nombre | Unidad | Precio Minorista | Precio Mayorista | Precio
     * Distribuidor | Stock Inicial |
     */
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
            // Buscar proveedor
            Proveedor proveedor = em.find(Proveedor.class, idProveedor);
            if (proveedor == null) {
                result.setExitoso(false);
                result.getMensajesError().add("Proveedor no encontrado con ID: " + idProveedor);
                return result;
            }

            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            int rowNum = 0;
            for (Row row : sheet) {
                // Saltar header
                if (rowNum == 0) {
                    rowNum++;
                    continue;
                }

                try {
                    result.setTotalFilas(result.getTotalFilas() + 1);

                    // Leer datos de la fila
                    String codigo = getCellValueAsString(row.getCell(0));
                    String nombre = getCellValueAsString(row.getCell(1));
                    String unidad = getCellValueAsString(row.getCell(2));
                    BigDecimal precioMinorista = getCellValueAsBigDecimal(row.getCell(3));
                    BigDecimal precioMayorista = getCellValueAsBigDecimal(row.getCell(4));
                    BigDecimal precioDistribuidor = getCellValueAsBigDecimal(row.getCell(5));
                    BigDecimal stockInicial = getCellValueAsBigDecimal(row.getCell(6));

                    // Validar datos obligatorios
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

                    // Buscar o crear ingrediente
                    Ingrediente ingrediente = findOrCreateIngrediente(codigo, nombre, unidad, stockInicial, result);

                    // Crear precios por tipo de cliente
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

    private Ingrediente findOrCreateIngrediente(String codigo, String nombre, String unidad,
            BigDecimal stockInicial, ImportResultDTO result) {
        Ingrediente ingrediente = null;

        // Buscar por código si existe
        if (codigo != null && !codigo.trim().isEmpty()) {
            List<Ingrediente> found = em.createQuery(
                    "SELECT i FROM Ingrediente i WHERE i.codigoInterno = :codigo", Ingrediente.class)
                    .setParameter("codigo", codigo.trim())
                    .getResultList();
            if (!found.isEmpty()) {
                ingrediente = found.get(0);
            }
        }

        // Si no existe, buscar por nombre
        if (ingrediente == null) {
            List<Ingrediente> found = em.createQuery(
                    "SELECT i FROM Ingrediente i WHERE i.nombre = :nombre", Ingrediente.class)
                    .setParameter("nombre", nombre.trim())
                    .getResultList();
            if (!found.isEmpty()) {
                ingrediente = found.get(0);
            }
        }

        // Si no existe, crear nuevo
        if (ingrediente == null) {
            ingrediente = new Ingrediente();
            ingrediente.setCodigoInterno(codigo != null ? codigo.trim() : null);
            ingrediente.setNombre(nombre.trim());
            ingrediente.setUnidadMedida(unidad.trim());
            ingrediente.setStockActual(stockInicial != null ? stockInicial : BigDecimal.ZERO);
            ingrediente.setStockMinimo(BigDecimal.ZERO);
            ingrediente.setPuntoReorden(BigDecimal.ZERO);
            ingrediente.setActivo(true);
            em.persist(ingrediente);
            result.setIngredientesCreados(result.getIngredientesCreados() + 1);
            Log.info("Ingrediente creado: " + nombre);
        } else {
            // Actualizar stock si se proporciona
            if (stockInicial != null && stockInicial.compareTo(BigDecimal.ZERO) > 0) {
                ingrediente.setStockActual(ingrediente.getStockActual().add(stockInicial));
                em.merge(ingrediente);
            }
            result.setIngredientesActualizados(result.getIngredientesActualizados() + 1);
            Log.info("Ingrediente actualizado: " + nombre);
        }

        return ingrediente;
    }

    private void createOrUpdatePrecio(Proveedor proveedor, Ingrediente ingrediente,
            PrecioProveedorIngrediente.TipoCliente tipoCliente,
            BigDecimal precio, ImportResultDTO result) {
        // Buscar precio existente
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
            // Crear nuevo precio
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
            // Actualizar precio existente
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
