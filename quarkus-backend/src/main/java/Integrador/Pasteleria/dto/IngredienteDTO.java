package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class IngredienteDTO {
    private Integer idIngrediente;
    private String codigoInterno;
    private String nombre;
    private String descripcion;
    private String categoria;
    private String unidadMedida;
    private BigDecimal stockActual;
    private BigDecimal stockMinimo;
    private BigDecimal stockMaximo;
    private BigDecimal puntoReorden;
    private BigDecimal costoPromedio;
    private BigDecimal ultimoCosto;
    private Boolean requiereRefrigeracion;
    private Integer diasVidaUtil;
    private Boolean alergeno;
    private Boolean activo;
}
