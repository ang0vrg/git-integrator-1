package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Pedido;
import Integrador.Pasteleria.Repositorio.PedidoRepositorio;
import Integrador.Pasteleria.dto.PedidoDTO;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PedidoService {
    @Inject
    PedidoRepositorio pedidoRepositorio;

    public List<PedidoDTO> getAllOrders() {
        return pedidoRepositorio.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PedidoDTO getOrderById(Integer id) {
        Pedido pedido = pedidoRepositorio.findById(id);
        if (pedido == null) {
            throw new NotFoundException("Pedido no encontrado con ID: " + id);
        }
        return convertToDTO(pedido);
    }

    @Transactional
    public PedidoDTO createOrder(PedidoDTO pedidoDTO) {
        Pedido pedido = convertToEntity(pedidoDTO);
        pedidoRepositorio.save(pedido);
        return convertToDTO(pedido);
    }

    @Transactional
    public PedidoDTO updateOrder(Integer id, PedidoDTO pedidoDTO) {
        Pedido existingPedido = pedidoRepositorio.findById(id);
        if (existingPedido == null) {
            throw new NotFoundException("Pedido no encontrado con ID: " + id);
        }
        existingPedido.setIdUserd(pedidoDTO.getIdUserd());
        existingPedido.setOrderDiscount(pedidoDTO.getOrderDiscount());
        existingPedido.setOrderTotal(pedidoDTO.getOrderTotal());
        existingPedido.setOrderDate(pedidoDTO.getOrderDate());
        pedidoRepositorio.update(existingPedido);
        return convertToDTO(existingPedido);
    }

    @Transactional
    public void deleteOrder(Integer id) {
        Pedido existingPedido = pedidoRepositorio.findById(id);
        if (existingPedido == null) {
            throw new NotFoundException("Pedido no encontrado con ID: " + id);
        }
        pedidoRepositorio.delete(id);
    }

    private Pedido convertToEntity(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setIdUserd(dto.getIdUserd());
        pedido.setOrderDiscount(dto.getOrderDiscount());
        pedido.setOrderTotal(dto.getOrderTotal());
        pedido.setOrderDate(dto.getOrderDate());
        return pedido;
    }

    private PedidoDTO convertToDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setIdOrder(pedido.getIdOrder());
        dto.setIdUserd(pedido.getIdUserd());
        dto.setOrderDiscount(pedido.getOrderDiscount());
        dto.setOrderTotal(pedido.getOrderTotal());
        dto.setOrderDate(pedido.getOrderDate());
        return dto;
    }
}
