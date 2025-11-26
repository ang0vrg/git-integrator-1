package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MetodoPagoDTO {
    private Integer idMetodoPago;
    private String codigo;
    private String nombre;
    private String descripcion;
    private String tipo;
    private String proveedor;
    private Boolean requiereValidacionOnline;
    private BigDecimal comisionPorcentaje;
    private Boolean activo;
}
