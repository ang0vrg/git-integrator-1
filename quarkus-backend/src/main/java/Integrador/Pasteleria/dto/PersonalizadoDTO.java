package Integrador.Pasteleria.dto;

import lombok.Data;

@Data
public class PersonalizadoDTO {
    private String tamano;
    private Integer pisos;
    private String sabor;
    private String decoracion;
    private String mensajeTorta;
    private String fechaEntrega;
    private String metodoEntrega;
    private String comentarioAdicional;
}