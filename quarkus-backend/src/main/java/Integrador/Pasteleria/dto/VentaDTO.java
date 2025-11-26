package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class VentaDTO {
    private Integer idSale;
    private Integer idPedido;
    private Integer idMetodoPago;
    private Integer idUsuarioRegistro;
    private String numeroVenta;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal montoCambio;
    private String estadoPago;
    private String referenciaTransaccion;
    private LocalDateTime saleDate;
    private LocalDateTime fechaPago;
}
