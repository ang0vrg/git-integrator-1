package Integrador.Pasteleria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrecioProveedorIngredienteDTO {
    private Integer idPrecio;
    private Integer idProveedor;
    private String nombreProveedor;
    private Integer idIngrediente;
    private String nombreIngrediente;
    private String tipoCliente;
    private BigDecimal precioUnitario;
    private BigDecimal cantidadMinima;
    private BigDecimal descuentoPorcentaje;
    private String moneda;
    private Boolean activo;
    private LocalDateTime fechaVigenciaInicio;
    private LocalDateTime fechaVigenciaFin;
}
