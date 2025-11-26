package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class CompraDetalleDTO {
    private Integer idDetalle;
    private Integer idCompra;
    private Integer idIngrediente;
    private BigDecimal cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private String numeroLote;
    private LocalDate fechaVencimiento;
}
