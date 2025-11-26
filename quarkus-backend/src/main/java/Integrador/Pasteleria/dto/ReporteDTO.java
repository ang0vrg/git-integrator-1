package Integrador.Pasteleria.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReporteDTO {
    private Integer idReport;
    private Integer idUsuarioGenerador;
    private String reportType;
    private String nombre;
    private String descripcion;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reportData;
    private String archivoUrl;
    private String estado;
}
