package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Compra;
import Integrador.Pasteleria.entity.CompraDetalle;
import Integrador.Pasteleria.entity.Proveedor;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.entity.Ingrediente;
import Integrador.Pasteleria.dto.CompraDTO;
import Integrador.Pasteleria.dto.CompraDetalleDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CompraService {

    @Inject
    EntityManager em;

    @Transactional
    public CompraDTO create(CompraDTO dto) {
        Compra compra = new Compra();
        Proveedor proveedor = em.find(Proveedor.class, dto.getIdProveedor());
        Usuario usuario = em.find(Usuario.class, dto.getIdUsuarioRegistro());

        compra.setProveedor(proveedor);
        compra.setUsuarioRegistro(usuario);
        compra.setNumeroOrden(dto.getNumeroOrden());
        compra.setFechaOrden(dto.getFechaOrden());
        compra.setFechaEntregaEstimada(dto.getFechaEntregaEstimada());
        compra.setSubtotal(dto.getSubtotal());
        compra.setImpuesto(dto.getImpuesto());
        compra.setTotal(dto.getTotal());
        compra.setEstado(Compra.Estado.pendiente);
        compra.setNotas(dto.getNotas());

        em.persist(compra);

        if (dto.getDetalles() != null) {
            for (CompraDetalleDTO detalleDTO : dto.getDetalles()) {
                CompraDetalle detalle = new CompraDetalle();
                detalle.setCompra(compra);
                detalle.setIngrediente(em.find(Ingrediente.class, detalleDTO.getIdIngrediente()));
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
                detalle.setSubtotal(detalleDTO.getSubtotal());
                em.persist(detalle);
            }
        }

        return convertToDTO(compra);
    }

    private CompraDTO convertToDTO(Compra entity) {
        CompraDTO dto = new CompraDTO();
        dto.setIdCompra(entity.getIdCompra());
        dto.setIdProveedor(entity.getProveedor().getIdSupplier());
        dto.setIdUsuarioRegistro(entity.getUsuarioRegistro().getIdUser());
        dto.setNumeroOrden(entity.getNumeroOrden());
        dto.setFechaOrden(entity.getFechaOrden());
        dto.setFechaEntregaEstimada(entity.getFechaEntregaEstimada());
        dto.setFechaEntregaReal(entity.getFechaEntregaReal());
        dto.setSubtotal(entity.getSubtotal());
        dto.setImpuesto(entity.getImpuesto());
        dto.setTotal(entity.getTotal());
        dto.setEstado(entity.getEstado().name());
        dto.setNotas(entity.getNotas());
        // Details conversion omitted for brevity, can be added if needed
        return dto;
    }
}
