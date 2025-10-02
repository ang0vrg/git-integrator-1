package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Producto;
import Integrador.Pasteleria.Repositorio.ProductoRepositorio;
import Integrador.Pasteleria.dto.ProductoDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductoService {
    @Inject
    ProductoRepositorio productoRepositorio;

    public List<ProductoDTO> getAllProducts() {
        return productoRepositorio.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO getProductById(Integer id) {
        Producto producto = productoRepositorio.findById(id);
        if (producto == null) {
            throw new NotFoundException("Producto no encontrado con ID: " + id);
        }
        return convertToDTO(producto);
    }

    @Transactional
    public ProductoDTO createProduct(ProductoDTO productoDTO) {
        Producto producto = convertToEntity(productoDTO);
        producto.setAddedOn(Timestamp.from(Instant.now()));
        productoRepositorio.save(producto);
        return convertToDTO(producto);
    }

    @Transactional
    public ProductoDTO updateProduct(Integer id, ProductoDTO productoDTO) {
        Producto existingProducto = productoRepositorio.findById(id);
        if (existingProducto == null) {
            throw new NotFoundException("Producto no encontrado con ID: " + id);
        }
        existingProducto.setProductName(productoDTO.getProductName());
        existingProducto.setProductDescription(productoDTO.getProductDescription());
        existingProducto.setProductPrice(productoDTO.getProductPrice());
        existingProducto.setProductQuantity(productoDTO.getProductQuantity());
        existingProducto.setIdSupplier(productoDTO.getIdSupplier());
        existingProducto.setUpdatedOn(Timestamp.from(Instant.now()));
        productoRepositorio.update(existingProducto);
        return convertToDTO(existingProducto);
    }

    @Transactional
    public void deleteProduct(Integer id) {
        Producto existingProducto = productoRepositorio.findById(id);
        if (existingProducto == null) {
            throw new NotFoundException("Producto no encontrado con ID: " + id);
        }
        productoRepositorio.delete(id);
    }

    private ProductoDTO convertToDTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setIdProduct(producto.getIdProduct());
        dto.setProductName(producto.getProductName());
        dto.setProductDescription(producto.getProductDescription());
        dto.setProductPrice(producto.getProductPrice());
        dto.setProductQuantity(producto.getProductQuantity());
        dto.setIdSupplier(producto.getIdSupplier());
        dto.setAddedOn(producto.getAddedOn());
        dto.setUpdatedOn(producto.getUpdatedOn());
        return dto;
    }

    private Producto convertToEntity(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setProductName(dto.getProductName());
        producto.setProductDescription(dto.getProductDescription());
        producto.setProductPrice(dto.getProductPrice());
        producto.setProductQuantity(dto.getProductQuantity());
        producto.setIdSupplier(dto.getIdSupplier());
        return producto;
    }
}
