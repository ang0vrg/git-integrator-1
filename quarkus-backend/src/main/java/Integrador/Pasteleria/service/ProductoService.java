package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Producto;
import Integrador.Pasteleria.entity.Receta;
import Integrador.Pasteleria.dto.ProductoDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductoService {

    @Inject
    EntityManager em;

    public List<ProductoDTO> findAll() {
        return em.createQuery("SELECT p FROM Producto p WHERE p.active = true", Producto.class)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoDTO create(ProductoDTO dto) {
        Producto producto = new Producto();
        updateEntityFromDTO(producto, dto);
        if (dto.getIdReceta() != null) {
            producto.setReceta(em.find(Receta.class, dto.getIdReceta()));
        }
        em.persist(producto);
        return convertToDTO(producto);
    }

    @Transactional
    public ProductoDTO update(Integer id, ProductoDTO dto) {
        Producto producto = em.find(Producto.class, id);
        if (producto != null) {
            updateEntityFromDTO(producto, dto);
            if (dto.getIdReceta() != null) {
                producto.setReceta(em.find(Receta.class, dto.getIdReceta()));
            }
            em.merge(producto);
            return convertToDTO(producto);
        }
        return null;
    }

    @Transactional
    public boolean updateImage(Integer id, String base64Image) {
        Producto producto = em.find(Producto.class, id);
        if (producto != null) {
            producto.setProductImage(base64Image);
            em.merge(producto);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean delete(Integer id) {
        Producto producto = em.find(Producto.class, id);
        if (producto != null) {
            producto.setActive(false);
            em.merge(producto);
            return true;
        }
        return false;
    }

    private void updateEntityFromDTO(Producto entity, ProductoDTO dto) {
        entity.setSku(dto.getSku());
        entity.setProductName(dto.getProductName());
        entity.setProductDescription(dto.getProductDescription());
        if (dto.getCategoria() != null)
            entity.setCategoria(Producto.Categoria.valueOf(dto.getCategoria()));
        entity.setProductPrice(dto.getProductPrice());
        entity.setPesoGramos(dto.getPesoGramos());
        entity.setPorciones(dto.getPorciones());
        entity.setRequiereRefrigeracion(dto.getRequiereRefrigeracion());
        entity.setDiasVidaUtil(dto.getDiasVidaUtil());
        entity.setDisponibleCatalogo(dto.getDisponibleCatalogo());
        entity.setRequierePedidoAnticipado(dto.getRequierePedidoAnticipado());
        entity.setDiasAnticipacion(dto.getDiasAnticipacion());
        entity.setProductImage(dto.getProductImage());
        entity.setEtiquetas(dto.getEtiquetas());
        entity.setOrdenVisualizacion(dto.getOrdenVisualizacion());
        entity.setDestacado(dto.getDestacado());
        if (dto.getActive() != null)
            entity.setActive(dto.getActive());
    }

    private ProductoDTO convertToDTO(Producto entity) {
        ProductoDTO dto = new ProductoDTO();
        dto.setIdProduct(entity.getIdProduct());
        if (entity.getReceta() != null)
            dto.setIdReceta(entity.getReceta().getIdReceta());
        dto.setSku(entity.getSku());
        dto.setProductName(entity.getProductName());
        dto.setProductDescription(entity.getProductDescription());
        dto.setCategoria(entity.getCategoria().name());
        dto.setCostoProduccion(entity.getCostoProduccion());
        dto.setMargenGanancia(entity.getMargenGanancia());
        dto.setProductPrice(entity.getProductPrice());
        dto.setPesoGramos(entity.getPesoGramos());
        dto.setPorciones(entity.getPorciones());
        dto.setRequiereRefrigeracion(entity.getRequiereRefrigeracion());
        dto.setDiasVidaUtil(entity.getDiasVidaUtil());
        dto.setDisponibleCatalogo(entity.getDisponibleCatalogo());
        dto.setRequierePedidoAnticipado(entity.getRequierePedidoAnticipado());
        dto.setDiasAnticipacion(entity.getDiasAnticipacion());
        dto.setStockDisponible(entity.getStockDisponible());
        dto.setProductImage(entity.getProductImage());
        dto.setEtiquetas(entity.getEtiquetas());
        dto.setOrdenVisualizacion(entity.getOrdenVisualizacion());
        dto.setDestacado(entity.getDestacado());
        dto.setActive(entity.getActive());
        return dto;
    }
}
