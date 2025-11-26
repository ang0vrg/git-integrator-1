package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RecetaDetalleDTO {
    private Integer idDetalle;
    private Integer idReceta;
    private Integer idIngrediente;
    private BigDecimal cantidad;
    private String unidadMedida;
    private Boolean esOpcional;
    private String notas;
}
