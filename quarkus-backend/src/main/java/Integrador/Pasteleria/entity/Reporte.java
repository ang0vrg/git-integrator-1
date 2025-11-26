package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "Reporte")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Integer idReport;

    @ManyToOne
    @JoinColumn(name = "id_usuario_generador", nullable = false)
    private Usuario usuarioGenerador;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_reporte", nullable = false)
    private ReportType reportType;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate startDate;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate endDate;

    @Column(name = "datos_json")
    private String reportData;

    @Column(name = "archivo_url")
    private String archivoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado = Estado.generando;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime updatedAt;

    public enum ReportType {
        ventas, pedidos, clientes, productos, inventario, financiero
    }

    public enum Estado {
        generando, completado, error
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
