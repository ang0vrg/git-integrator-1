package Integrador.Pasteleria.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DireccionDTO {
    private Integer idDireccion;
    private Integer idUsuario;
    private String alias;
    private String calle;
    private String numero;
    private String pisoDpto;
    private String distrito;
    private String ciudad;
    private String codigoPostal;
    private String referencia;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private Boolean esPredeterminada;
    private Boolean activa;
}
