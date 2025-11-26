package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "LoteIngrediente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoteIngrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lote")
    private Integer idLote;

    @ManyToOne
    @JoinColumn(name = "id_ingrediente", nullable = false)
    private Ingrediente ingrediente;

    @Column(name = "numero_lote", nullable = false)
    private String numeroLote;

    @Column(name = "cantidad", nullable = false)
    private BigDecimal cantidad;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "cantidad_disponible", nullable = false)
    private BigDecimal cantidadDisponible;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado = Estado.disponible;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    public enum Estado {
        disponible, agotado, vencido
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
