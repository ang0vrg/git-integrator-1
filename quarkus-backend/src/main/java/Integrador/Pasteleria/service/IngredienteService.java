package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Ingrediente;
import Integrador.Pasteleria.dto.IngredienteDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@ApplicationScoped
public class IngredienteService {

    @Inject
    EntityManager em;

    public List<IngredienteDTO> findAll() {
        return findAll(null);
    }

    public List<IngredienteDTO> findAll(String categoria) {
        String query = "SELECT i FROM Ingrediente i WHERE i.activo = true";
        if (categoria != null && !categoria.trim().isEmpty()) {
            query += " AND i.categoria = :categoria";
        }
        query += " ORDER BY i.nombre ASC";

        var q = em.createQuery(query, Ingrediente.class);
        if (categoria != null && !categoria.trim().isEmpty()) {
            q.setParameter("categoria", Ingrediente.Categoria.valueOf(categoria));
        }

        return q.getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IngredienteDTO> findBajoStock() {
        return em.createQuery(
                "SELECT i FROM Ingrediente i WHERE i.activo = true " +
                        "AND i.stockActual <= i.puntoReorden " +
                        "ORDER BY i.stockActual ASC",
                Ingrediente.class)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getInventoryStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Total de ingredientes activos
        Long totalIngredientes = em.createQuery(
                "SELECT COUNT(i) FROM Ingrediente i WHERE i.activo = true", Long.class)
                .getSingleResult();
        stats.put("totalIngredientes", totalIngredientes);

        // Ingredientes con stock bajo
        Long bajoStock = em.createQuery(
                "SELECT COUNT(i) FROM Ingrediente i WHERE i.activo = true AND i.stockActual <= i.puntoReorden",
                Long.class)
                .getSingleResult();
        stats.put("bajoStock", bajoStock);

        // Ingredientes sin stock
        Long sinStock = em.createQuery(
                "SELECT COUNT(i) FROM Ingrediente i WHERE i.activo = true AND i.stockActual = 0",
                Long.class)
                .getSingleResult();
        stats.put("sinStock", sinStock);

        // Valor total del inventario
        BigDecimal valorTotal = em.createQuery(
                "SELECT SUM(i.stockActual * i.costoPromedio) FROM Ingrediente i WHERE i.activo = true",
                BigDecimal.class)
                .getSingleResult();
        stats.put("valorTotal", valorTotal != null ? valorTotal : BigDecimal.ZERO);

        return stats;
    }

    @Transactional
    public boolean registrarMovimiento(Integer id, BigDecimal cantidad, String tipo, String motivo) {
        Ingrediente ingrediente = em.find(Ingrediente.class, id);
        if (ingrediente == null) {
            return false;
        }

        if ("entrada".equalsIgnoreCase(tipo)) {
            ingrediente.setStockActual(ingrediente.getStockActual().add(cantidad));
        } else if ("salida".equalsIgnoreCase(tipo)) {
            BigDecimal nuevoStock = ingrediente.getStockActual().subtract(cantidad);
            if (nuevoStock.compareTo(BigDecimal.ZERO) < 0) {
                return false; // No permitir stock negativo
            }
            ingrediente.setStockActual(nuevoStock);
        } else {
            return false;
        }

        em.merge(ingrediente);
        return true;
    }

    @Transactional
    public IngredienteDTO create(IngredienteDTO dto) {
        Ingrediente ingrediente = new Ingrediente();
        updateEntityFromDTO(ingrediente, dto);
        em.persist(ingrediente);
        return convertToDTO(ingrediente);
    }

    @Transactional
    public IngredienteDTO update(Integer id, IngredienteDTO dto) {
        Ingrediente ingrediente = em.find(Ingrediente.class, id);
        if (ingrediente != null) {
            updateEntityFromDTO(ingrediente, dto);
            em.merge(ingrediente);
            return convertToDTO(ingrediente);
        }
        return null;
    }

    @Transactional
    public boolean delete(Integer id) {
        Ingrediente ingrediente = em.find(Ingrediente.class, id);
        if (ingrediente != null) {
            ingrediente.setActivo(false);
            em.merge(ingrediente);
            return true;
        }
        return false;
    }

    private void updateEntityFromDTO(Ingrediente entity, IngredienteDTO dto) {
        entity.setCodigoInterno(dto.getCodigoInterno());
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        if (dto.getCategoria() != null)
            entity.setCategoria(Ingrediente.Categoria.valueOf(dto.getCategoria()));
        entity.setUnidadMedida(dto.getUnidadMedida());
        entity.setStockActual(dto.getStockActual());
        entity.setStockMinimo(dto.getStockMinimo());
        entity.setStockMaximo(dto.getStockMaximo());
        entity.setPuntoReorden(dto.getPuntoReorden());
        entity.setCostoPromedio(dto.getCostoPromedio());
        entity.setUltimoCosto(dto.getUltimoCosto());
        entity.setPrecioMinorista(dto.getPrecioMinorista());
        entity.setPrecioMayorista(dto.getPrecioMayorista());
        entity.setPrecioDistribuidor(dto.getPrecioDistribuidor());
        entity.setRequiereRefrigeracion(dto.getRequiereRefrigeracion());
        entity.setDiasVidaUtil(dto.getDiasVidaUtil());
        entity.setAlergeno(dto.getAlergeno());
        if (dto.getActivo() != null)
            entity.setActivo(dto.getActivo());
    }

    private IngredienteDTO convertToDTO(Ingrediente entity) {
        IngredienteDTO dto = new IngredienteDTO();
        dto.setIdIngrediente(entity.getIdIngrediente());
        dto.setCodigoInterno(entity.getCodigoInterno());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setCategoria(entity.getCategoria().name());
        dto.setUnidadMedida(entity.getUnidadMedida());
        dto.setStockActual(entity.getStockActual());
        dto.setStockMinimo(entity.getStockMinimo());
        dto.setStockMaximo(entity.getStockMaximo());
        dto.setPuntoReorden(entity.getPuntoReorden());
        dto.setCostoPromedio(entity.getCostoPromedio());
        dto.setUltimoCosto(entity.getUltimoCosto());
        dto.setPrecioMinorista(entity.getPrecioMinorista());
        dto.setPrecioMayorista(entity.getPrecioMayorista());
        dto.setPrecioDistribuidor(entity.getPrecioDistribuidor());
        dto.setRequiereRefrigeracion(entity.getRequiereRefrigeracion());
        dto.setDiasVidaUtil(entity.getDiasVidaUtil());
        dto.setAlergeno(entity.getAlergeno());
        dto.setActivo(entity.getActivo());
        return dto;
    }
}
