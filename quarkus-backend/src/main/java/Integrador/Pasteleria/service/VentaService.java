package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Venta;
import Integrador.Pasteleria.entity.Pedido;
import Integrador.Pasteleria.entity.MetodoPago;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.dto.VentaDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class VentaService {

    @Inject
    EntityManager em;

    @Transactional
    public VentaDTO create(VentaDTO dto) {
        Venta venta = new Venta();
        venta.setOrder(em.find(Pedido.class, dto.getIdPedido()));
        venta.setMetodoPago(em.find(MetodoPago.class, dto.getIdMetodoPago()));
        if (dto.getIdUsuarioRegistro() != null) {
            venta.setUsuarioRegistro(em.find(Usuario.class, dto.getIdUsuarioRegistro()));
        }

        venta.setNumeroVenta(dto.getNumeroVenta());
        venta.setMontoTotal(dto.getMontoTotal());
        venta.setMontoPagado(dto.getMontoPagado());
        venta.setMontoCambio(dto.getMontoCambio());
        if (dto.getEstadoPago() != null)
            venta.setEstadoPago(Venta.EstadoPago.valueOf(dto.getEstadoPago()));
        venta.setReferenciaTransaccion(dto.getReferenciaTransaccion());
        venta.setSaleDate(dto.getSaleDate());
        venta.setFechaPago(dto.getFechaPago());

        em.persist(venta);
        return convertToDTO(venta);
    }

    private VentaDTO convertToDTO(Venta entity) {
        VentaDTO dto = new VentaDTO();
        dto.setIdSale(entity.getIdSale());
        dto.setIdPedido(entity.getOrder().getIdOrder());
        dto.setIdMetodoPago(entity.getMetodoPago().getIdMetodoPago());
        if (entity.getUsuarioRegistro() != null)
            dto.setIdUsuarioRegistro(entity.getUsuarioRegistro().getIdUser());
        dto.setNumeroVenta(entity.getNumeroVenta());
        dto.setMontoTotal(entity.getMontoTotal());
        dto.setMontoPagado(entity.getMontoPagado());
        dto.setMontoCambio(entity.getMontoCambio());
        dto.setEstadoPago(entity.getEstadoPago().name());
        dto.setReferenciaTransaccion(entity.getReferenciaTransaccion());
        dto.setSaleDate(entity.getSaleDate());
        dto.setFechaPago(entity.getFechaPago());
        return dto;
    }
}
