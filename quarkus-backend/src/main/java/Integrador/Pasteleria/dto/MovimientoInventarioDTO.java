package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class MovimientoInventarioDTO {
    private Integer idMovimiento;
    private Integer idIngrediente;
    private Integer idUsuario;
    private Integer idCompra;
    private Integer idPedido;
    private String tipoMovimiento;
    private BigDecimal cantidad;
    private BigDecimal stockAnterior;
    private BigDecimal stockActual;
    private String motivo;
    private String numeroLote;
    private LocalDateTime fechaMovimiento;
}
