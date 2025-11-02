package Integrador.Pasteleria.dto;
public class UsuarioDTO {
    public Integer id;
    public String username;
    public String userEmail;
    public String userRole; // ← String, NO Usuario.Role
    public String phoneNumber;
    public java.time.LocalDateTime createdAt;

    public UsuarioDTO(Integer id, String username, String userEmail, String userRole, String phoneNumber,
            java.time.LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
    }
}