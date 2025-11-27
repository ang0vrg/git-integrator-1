package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Importacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Importacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_importacion")
    private Integer idImportacion;

    @ManyToOne
    @JoinColumn(name = "id_proveedor", nullable = false)
    private Proveedor proveedor;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "observaciones")
    private String observaciones;

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
    }
}
