package Integrador.Pasteleria.dto;

import lombok.Data;

@Data
public class ContactDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String asunto;
    private String mensaje;
}
