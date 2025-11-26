package Integrador.Pasteleria.dto;

import lombok.Data;

@Data
public class EstadoPedidoDTO {
    private Integer idEstado;
    private String codigo;
    private String nombre;
    private String descripcion;
    private Integer orden;
    private String colorHex;
    private String icono;
    private Boolean esEstadoInicial;
    private Boolean esEstadoFinal;
    private Boolean requiereNotificacion;
    private Boolean activo;
}
