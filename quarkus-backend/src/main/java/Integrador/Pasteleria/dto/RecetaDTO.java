package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RecetaDTO {
    private Integer idReceta;
    private String codigo;
    private String nombre;
    private String descripcion;
    private Integer porciones;
    private Integer tiempoPreparacionMin;
    private String dificultad;
    private BigDecimal costoIngredientes;
    private BigDecimal costoManoObra;
    private BigDecimal costoTotal;
    private String instrucciones;
    private String notasAlergenos;
    private Boolean activa;
    private List<RecetaDetalleDTO> detalles;
}
