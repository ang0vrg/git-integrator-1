package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class LoteIngredienteDTO {
    private Integer idLote;
    private Integer idIngrediente;
    private String numeroLote;
    private BigDecimal cantidad;
    private LocalDate fechaIngreso;
    private LocalDate fechaVencimiento;
    private BigDecimal cantidadDisponible;
    private String estado;
}
