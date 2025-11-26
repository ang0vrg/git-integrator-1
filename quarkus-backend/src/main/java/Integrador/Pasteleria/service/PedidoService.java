package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Pedido;
import Integrador.Pasteleria.entity.DetallePedido;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.entity.Direccion;
import Integrador.Pasteleria.entity.EstadoPedido;
import Integrador.Pasteleria.entity.Producto;
import Integrador.Pasteleria.dto.PedidoDTO;
import Integrador.Pasteleria.dto.DetallePedidoDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PedidoService {

    @Inject
    EntityManager em;

    @Transactional
    public PedidoDTO create(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setUser(em.find(Usuario.class, dto.getIdUsuario()));
        if (dto.getIdDireccion() != null) {
            pedido.setDireccion(em.find(Direccion.class, dto.getIdDireccion()));
        }
        // Set initial status (assuming ID 1 is pending or similar, or look up by code)
        // For now, let's assume we pass the status ID or default to 1
        pedido.setEstadoActual(
                em.find(EstadoPedido.class, dto.getIdEstadoActual() != null ? dto.getIdEstadoActual() : 1));

        pedido.setNumeroPedido(dto.getNumeroPedido()); // Should be generated
        pedido.setOrderDate(dto.getOrderDate());
        pedido.setFechaEntregaEstimada(dto.getFechaEntregaEstimada());
        pedido.setSubtotal(dto.getSubtotal());
        pedido.setOrderDiscount(dto.getOrderDiscount());
        pedido.setImpuesto(dto.getImpuesto());
        pedido.setCostoEnvio(dto.getCostoEnvio());
        pedido.setOrderTotal(dto.getOrderTotal());
        if (dto.getMetodoEntrega() != null)
            pedido.setMetodoEntrega(Pedido.MetodoEntrega.valueOf(dto.getMetodoEntrega()));
        pedido.setNotasCliente(dto.getNotasCliente());
        pedido.setDedicatoria(dto.getDedicatoria());

        em.persist(pedido);

        if (dto.getDetalles() != null) {
            for (DetallePedidoDTO detalleDTO : dto.getDetalles()) {
                DetallePedido detalle = new DetallePedido();
                detalle.setOrder(pedido);
                detalle.setProduct(em.find(Producto.class, detalleDTO.getIdProduct()));
                detalle.setQuantity(detalleDTO.getQuantity());
                detalle.setPrice(detalleDTO.getPrice());
                detalle.setSubtotal(detalleDTO.getSubtotal());
                detalle.setPersonalizacion(detalleDTO.getPersonalizacion());
                em.persist(detalle);
            }
        }

        return convertToDTO(pedido);
    }

    private PedidoDTO convertToDTO(Pedido entity) {
        PedidoDTO dto = new PedidoDTO();
        dto.setIdOrder(entity.getIdOrder());
        dto.setIdUsuario(entity.getUser().getIdUser());
        if (entity.getDireccion() != null)
            dto.setIdDireccion(entity.getDireccion().getIdDireccion());
        if (entity.getEstadoActual() != null)
            dto.setIdEstadoActual(entity.getEstadoActual().getIdEstado());
        dto.setNumeroPedido(entity.getNumeroPedido());
        dto.setOrderDate(entity.getOrderDate());
        dto.setFechaEntregaEstimada(entity.getFechaEntregaEstimada());
        dto.setFechaEntregaReal(entity.getFechaEntregaReal());
        dto.setSubtotal(entity.getSubtotal());
        dto.setOrderDiscount(entity.getOrderDiscount());
        dto.setImpuesto(entity.getImpuesto());
        dto.setCostoEnvio(entity.getCostoEnvio());
        dto.setOrderTotal(entity.getOrderTotal());
        dto.setMetodoEntrega(entity.getMetodoEntrega().name());
        dto.setNotasCliente(entity.getNotasCliente());
        dto.setNotasInternas(entity.getNotasInternas());
        dto.setDedicatoria(entity.getDedicatoria());
        dto.setCodigoSeguimiento(entity.getCodigoSeguimiento());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
