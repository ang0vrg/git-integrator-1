package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PedidoDTO {
    private Integer idOrder;
    private Integer idUsuario;
    private Integer idDireccion;
    private Integer idEstadoActual;
    private String numeroPedido;
    private LocalDateTime orderDate;
    private LocalDateTime fechaEntregaEstimada;
    private LocalDateTime fechaEntregaReal;
    private BigDecimal subtotal;
    private BigDecimal orderDiscount;
    private BigDecimal impuesto;
    private BigDecimal costoEnvio;
    private BigDecimal orderTotal;
    private String metodoEntrega;
    private String notasCliente;
    private String notasInternas;
    private String dedicatoria;
    private String codigoSeguimiento;
    private LocalDateTime createdAt;
    private List<DetallePedidoDTO> detalles;
}
