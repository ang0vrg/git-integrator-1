package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "EstadoPedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    private Integer idEstado;

    @Column(name = "codigo", nullable = false, unique = true)
    private String codigo;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "orden", nullable = false, unique = true)
    private Integer orden;

    @Column(name = "color_hex")
    private String colorHex = "#CCCCCC";

    @Column(name = "icono")
    private String icono;

    @Column(name = "es_estado_inicial")
    private Boolean esEstadoInicial = false;

    @Column(name = "es_estado_final")
    private Boolean esEstadoFinal = false;

    @Column(name = "requiere_notificacion")
    private Boolean requiereNotificacion = true;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
