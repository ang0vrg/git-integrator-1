package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.DetallePedido;
import Integrador.Pasteleria.Repositorio.DetallePedidoRepositorio;
import Integrador.Pasteleria.dto.DetallePedidoDTO;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DetallePedidoService {
    @Inject
    DetallePedidoRepositorio detallePedidoRepositorio;

    public List<DetallePedidoDTO> getAllOrderDetails() {
        return detallePedidoRepositorio.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DetallePedidoDTO getOrderDetailById(Integer id) {
        DetallePedido detallePedido = detallePedidoRepositorio.findById(id);
        if (detallePedido == null) {
            throw new NotFoundException("DetallePedido no encontrado con ID: " + id);
        }
        return convertToDTO(detallePedido);
    }

    @Transactional
    public DetallePedidoDTO createOrderDetail(DetallePedidoDTO detallePedidoDTO) {
        DetallePedido detallePedido = convertToEntity(detallePedidoDTO);
        detallePedidoRepositorio.save(detallePedido);
        return convertToDTO(detallePedido);
    }

    @Transactional
    public DetallePedidoDTO updateOrderDetail(Integer id, DetallePedidoDTO detallePedidoDTO) {
        DetallePedido existingDetallePedido = detallePedidoRepositorio.findById(id);
        if (existingDetallePedido == null) {
            throw new NotFoundException("DetallePedido no encontrado con ID: " + id);
        }
        existingDetallePedido.setIdOrderDetail(detallePedidoDTO.getIdOrderDetail());
        existingDetallePedido.setIdOrder(detallePedidoDTO.getIdOrder());
        existingDetallePedido.setIdProduct(detallePedidoDTO.getIdProduct());
        existingDetallePedido.setQuantity(detallePedidoDTO.getQuantity());
        existingDetallePedido.setPrice(detallePedidoDTO.getPrice());
        detallePedidoRepositorio.update(existingDetallePedido);
        return convertToDTO(existingDetallePedido);
    }

    @Transactional
    public void deleteOrderDetail(Integer id) {
        DetallePedido existingDetallePedido = detallePedidoRepositorio.findById(id);
        if (existingDetallePedido == null) {
            throw new NotFoundException("DetallePedido no encontrado con ID: " + id);
        }
        detallePedidoRepositorio.delete(id);
    }

    private DetallePedidoDTO convertToDTO(DetallePedido detallePedido) {
        DetallePedidoDTO dto = new DetallePedidoDTO();
        dto.setIdOrderDetail(detallePedido.getIdOrderDetail());
        dto.setIdOrder(detallePedido.getIdOrder());
        dto.setIdProduct(detallePedido.getIdProduct());
        dto.setQuantity(detallePedido.getQuantity());
        dto.setPrice(detallePedido.getPrice());
        return dto;
    }

    private DetallePedido convertToEntity(DetallePedidoDTO dto) {
        DetallePedido detallePedido = new DetallePedido();
        detallePedido.setIdOrderDetail(dto.getIdOrderDetail());
        detallePedido.setIdOrder(dto.getIdOrder());
        detallePedido.setIdProduct(dto.getIdProduct());
        detallePedido.setQuantity(dto.getQuantity());
        detallePedido.setPrice(dto.getPrice());
        return detallePedido;
    }
}
