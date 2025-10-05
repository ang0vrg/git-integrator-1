package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.DetallePedido;
import Integrador.Pasteleria.entity.Pedido;
import Integrador.Pasteleria.Repositorio.PedidoRepositorio;
import Integrador.Pasteleria.dto.CrearPedidoRequestDTO;
import Integrador.Pasteleria.dto.DatosPedidoDTO;
import Integrador.Pasteleria.dto.PedidoDTO;
import Integrador.Pasteleria.dto.ProductoDTO;
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

    @Inject
    DetallePedidoService detallePedidoService;

    @Inject
    ProductoService productoService;

    @Inject
    Integrador.Pasteleria.Repositorio.DetallePedidoRepositorio detallePedidoRepositorio;

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
    public PedidoDTO createOrder(CrearPedidoRequestDTO requestDTO) {

        
        Pedido pedido = new Pedido();
        pedido.setIdUser(requestDTO.getIdUser());
        pedido.setOrderDate(new java.sql.Timestamp(System.currentTimeMillis()));
        pedido.setOrderDiscount(0.0);

        Pedido pedidoGuardado = pedidoRepositorio.save(pedido);

        double total = 0.0;

        for (DatosPedidoDTO item : requestDTO.getProductos()) {
            ProductoDTO producto = productoService.getProductById(item.getIdproduct());
            productoService.validarStock(item.getIdproduct(), item.getQuantity());
        
        DetallePedido detallePedido = new DetallePedido();
            detallePedido.setIdOrder(pedido.getIdOrder());
            detallePedido.setIdProduct(item.getIdproduct());
            detallePedido.setQuantity(item.getQuantity());
            detallePedido.setPrice(producto.getProductPrice());
            detallePedidoRepositorio.save(detallePedido); 

            productoService.actualizarStock(item.getIdproduct(), item.getQuantity());

            total += producto.getProductPrice() * item.getQuantity();
        }
        pedidoGuardado.setOrderTotal(total);
        pedidoRepositorio.update(pedidoGuardado);
        
        // Optionally, create DetallePedido entries here using detallePedidoService
        // Return DTO
        return convertToDTO(pedidoGuardado);
    }

    @Transactional
    public PedidoDTO updateOrder(Integer id, PedidoDTO pedidoDTO) {
        Pedido existingPedido = pedidoRepositorio.findById(id);
        if (existingPedido == null) {
            throw new NotFoundException("Pedido no encontrado con ID: " + id);
        }
        existingPedido.setIdUser(pedidoDTO.getIdUser());
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
        pedido.setIdUser(dto.getIdUser());
        pedido.setOrderDiscount(dto.getOrderDiscount());
        pedido.setOrderTotal(dto.getOrderTotal());
        pedido.setOrderDate(dto.getOrderDate());
        return pedido;
    }

    private PedidoDTO convertToDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setIdOrder(pedido.getIdOrder());
        dto.setIdUser(pedido.getIdUser());
        dto.setOrderDiscount(pedido.getOrderDiscount());
        dto.setOrderTotal(pedido.getOrderTotal());
        dto.setOrderDate(pedido.getOrderDate());
        return dto;
    }
}
