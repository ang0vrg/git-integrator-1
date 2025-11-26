package Integrador.Pasteleria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Integer idUser;
    private String username;
    private String userEmail;
    private String userRole;
    private String phoneNumber;
    private LocalDateTime lastAccess;
    private Boolean active;
    private LocalDateTime createdAt;

    public UsuarioDTO(Integer idUser, String username, String userEmail, String userRole, String phoneNumber,
            LocalDateTime createdAt) {
        this.idUser = idUser;
        this.username = username;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
    }
}