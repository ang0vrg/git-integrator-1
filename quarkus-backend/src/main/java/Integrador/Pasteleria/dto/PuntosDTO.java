package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PuntosDTO {
    private Integer idPoint;
    private Integer idUsuario;
    private Integer idVenta;
    private String tipoMovimiento;
    private Integer pointsEarned;
    private Integer saldoAnterior;
    private Integer totalPoints;
    private String concepto;
    private LocalDate fechaVencimiento;
}
