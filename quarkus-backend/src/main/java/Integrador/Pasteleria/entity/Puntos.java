package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "Puntos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Puntos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_punto")
    private Integer idPoint;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario idUser;

    @ManyToOne
    @JoinColumn(name = "id_venta")
    private Venta idSale;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @Column(name = "puntos_movimiento", nullable = false)
    private Integer pointsEarned; // Using pointsEarned for movement amount

    @Column(name = "saldo_anterior")
    private Integer saldoAnterior = 0;

    @Column(name = "saldo_actual", insertable = false, updatable = false)
    private Integer totalPoints;

    @Column(name = "concepto")
    private String concepto;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    public enum TipoMovimiento {
        ganados, canjeados, vencidos, ajuste
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
