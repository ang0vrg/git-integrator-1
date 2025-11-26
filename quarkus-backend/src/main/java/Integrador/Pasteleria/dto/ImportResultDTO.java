package Integrador.Pasteleria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportResultDTO {
    private Integer totalFilas;
    private Integer ingredientesCreados;
    private Integer ingredientesActualizados;
    private Integer preciosCreados;
    private Integer errores;
    private java.util.List<String> mensajesError;
    private Boolean exitoso;
}
