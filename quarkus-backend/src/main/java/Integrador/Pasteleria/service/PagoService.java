package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.CartItemDTO;
import Integrador.Pasteleria.dto.PagoDTO;
import Integrador.Pasteleria.dto.VentaDTO;
import Integrador.Pasteleria.entity.*;
import Integrador.Pasteleria.repository.PagoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class PagoService {

    @Inject
    PagoRepository pagoRepository;

    @Inject
    EntityManager em;

    @Inject
    VentaService ventaService;

    @Transactional
    public PagoDTO registrarPago(PagoDTO dto) {
        // Validate required fields
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío");
        }
        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("Usuario no especificado");
        }

        // 1. Get user
        Usuario usuario = em.find(Usuario.class, dto.getIdUsuario());
        if (usuario == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        // 2. Get or create MetodoPago
        MetodoPago metodoPago = getMetodoPago(dto.getMetodoPago());

        // 3. Get initial order status (pending)
        EstadoPedido estadoPendiente = em.createQuery(
                "SELECT e FROM EstadoPedido e WHERE e.codigo = :codigo", EstadoPedido.class)
                .setParameter("codigo", "pendiente")
                .getResultStream()
                .findFirst()
                .orElseGet(() -> em.find(EstadoPedido.class, 1)); // Fallback to ID 1

        // 4. Create Pedido (Order)
        Pedido pedido = new Pedido();
        pedido.setUser(usuario);
        pedido.setEstadoActual(estadoPendiente);
        pedido.setNumeroPedido(generateOrderNumber());

        // Calculate totals from cart items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItemDTO item : dto.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        pedido.setSubtotal(subtotal);
        pedido.setOrderDiscount(BigDecimal.ZERO);
        pedido.setImpuesto(BigDecimal.ZERO);
        pedido.setCostoEnvio(BigDecimal.ZERO);
        pedido.setOrderTotal(subtotal);
        pedido.setMetodoEntrega(Pedido.MetodoEntrega.delivery);
        pedido.setNotasCliente(dto.getNotasCliente());
        pedido.setDedicatoria(dto.getDedicatoria());

        em.persist(pedido);

        // 5. Create order details
        for (CartItemDTO item : dto.getItems()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setOrder(pedido);

            Producto producto = em.find(Producto.class, item.getIdProduct());
            if (producto == null) {
                throw new IllegalArgumentException("Producto no encontrado: " + item.getIdProduct());
            }

            detalle.setProduct(producto);
            detalle.setQuantity(item.getQuantity());
            detalle.setPrice(item.getPrice());
            detalle.setSubtotal(item.getPrice().multiply(new BigDecimal(item.getQuantity())));

            em.persist(detalle);
        }

        // 6. Create Venta (Sale)
        VentaDTO ventaDTO = new VentaDTO();
        ventaDTO.setIdPedido(pedido.getIdOrder());
        ventaDTO.setIdMetodoPago(metodoPago.getIdMetodoPago());
        ventaDTO.setIdUsuarioRegistro(usuario.getIdUser());
        ventaDTO.setNumeroVenta(generateSaleNumber());
        ventaDTO.setMontoTotal(subtotal);
        ventaDTO.setMontoPagado(subtotal);
        ventaDTO.setMontoCambio(BigDecimal.ZERO);
        ventaDTO.setEstadoPago("pagado");
        ventaDTO.setReferenciaTransaccion(dto.getCodigoOperacion());
        ventaDTO.setSaleDate(LocalDateTime.now());
        ventaDTO.setFechaPago(LocalDateTime.now());

        VentaDTO ventaCreada = ventaService.create(ventaDTO);

        // 7. Create Pago record
        Pago pago = new Pago();
        pago.setMonto(dto.getMonto());
        pago.setMetodoPago(dto.getMetodoPago());
        pago.setFecha(LocalDateTime.now());
        pago.setEstado("COMPLETADO");
        pago.setCodigoOperacion(dto.getCodigoOperacion());
        pago.setIdVenta(ventaCreada.getIdSale());

        pagoRepository.persist(pago);

        // 8. Return DTO
        dto.setIdPago(pago.getIdPago());
        dto.setFecha(pago.getFecha());
        dto.setEstado(pago.getEstado());
        dto.setIdVenta(ventaCreada.getIdSale());

        return dto;
    }

    private MetodoPago getMetodoPago(String metodoPagoNombre) {
        // Try to find by exact name match first
        MetodoPago metodoPago = em.createQuery(
                "SELECT m FROM MetodoPago m WHERE UPPER(m.nombre) = :nombre AND m.activo = true",
                MetodoPago.class)
                .setParameter("nombre", metodoPagoNombre.toUpperCase())
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (metodoPago != null) {
            return metodoPago;
        }

        // Try to find by code
        metodoPago = em.createQuery(
                "SELECT m FROM MetodoPago m WHERE UPPER(m.codigo) = :codigo AND m.activo = true",
                MetodoPago.class)
                .setParameter("codigo", metodoPagoNombre.toUpperCase())
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (metodoPago != null) {
            return metodoPago;
        }

        // If not found, create a new one
        metodoPago = new MetodoPago();
        metodoPago.setCodigo(metodoPagoNombre.toUpperCase());
        metodoPago.setNombre(metodoPagoNombre);
        metodoPago.setDescripcion("Método de pago " + metodoPagoNombre);
        metodoPago.setTipo(getPaymentType(metodoPagoNombre));
        metodoPago.setActivo(true);
        em.persist(metodoPago);

        return metodoPago;
    }

    private MetodoPago.Tipo getPaymentType(String metodoPago) {
        String upper = metodoPago.toUpperCase();
        if (upper.contains("YAPE") || upper.contains("PLIN") || upper.contains("PAYPAL")) {
            return MetodoPago.Tipo.billetera_digital;
        } else if (upper.contains("TARJETA") || upper.contains("CARD")) {
            return MetodoPago.Tipo.tarjeta;
        } else if (upper.contains("EFECTIVO") || upper.contains("CASH")) {
            return MetodoPago.Tipo.efectivo;
        } else if (upper.contains("TRANSFERENCIA") || upper.contains("TRANSFER")) {
            return MetodoPago.Tipo.transferencia;
        }
        return MetodoPago.Tipo.otro;
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private String generateSaleNumber() {
        return "VTA-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
