package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUser;

    @Column(name = "nombre_usuario", nullable = false, unique = true)
    private String username;

    @Column(name = "correo", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "contrasena", nullable = false)
    private String userPassword;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Role userRole = Role.cliente;

    @Column(name = "telefono", unique = true)
    private String phoneNumber;

    @Column(name = "ultimo_acceso")
    private LocalDateTime lastAccess;

    @Column(name = "intentos_fallidos")
    private Integer failedAttempts = 0;

    @Column(name = "cuenta_bloqueada")
    private Boolean accountLocked = false;

    @Column(name = "token_recuperacion")
    private String recoveryToken;

    @Column(name = "token_expiracion")
    private LocalDateTime tokenExpiration;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime updatedAt;

    @Column(name = "fecha_eliminacion")
    private LocalDateTime deletedAt;

    @Column(name = "activo")
    private Boolean active = true;

    public enum Role {
        cliente,
        administrador,
        trabajador
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
