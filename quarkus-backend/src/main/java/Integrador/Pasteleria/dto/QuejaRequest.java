package Integrador.Pasteleria.dto;

/**DTO para recibir la información de la queja o consulta desde el frontend*/
public class QuejaRequest {
    
    // Campos del formulario
    public String firstName; 
    public String lastName;
    public String email;
    public String phone; 
    public String subject;
    public String message;

    public QuejaRequest() {}
}