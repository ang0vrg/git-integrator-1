package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CompraDTO {
    private Integer idCompra;
    private Integer idProveedor;
    private Integer idUsuarioRegistro;
    private String numeroOrden;
    private LocalDate fechaOrden;
    private LocalDate fechaEntregaEstimada;
    private LocalDate fechaEntregaReal;
    private BigDecimal subtotal;
    private BigDecimal impuesto;
    private BigDecimal total;
    private String estado;
    private String notas;
    private List<CompraDetalleDTO> detalles;
}
