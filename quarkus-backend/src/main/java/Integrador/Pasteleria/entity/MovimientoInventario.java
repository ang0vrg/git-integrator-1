package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "MovimientoInventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Integer idMovimiento;

    @ManyToOne
    @JoinColumn(name = "id_ingrediente", nullable = false)
    private Ingrediente ingrediente;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_compra")
    private Compra compra;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @Column(name = "cantidad", nullable = false)
    private BigDecimal cantidad;

    @Column(name = "stock_anterior", nullable = false)
    private BigDecimal stockAnterior;

    @Column(name = "stock_actual", nullable = false)
    private BigDecimal stockActual;

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "numero_lote")
    private String numeroLote;

    @Column(name = "fecha_movimiento", updatable = false)
    private LocalDateTime fechaMovimiento;

    public enum TipoMovimiento {
        ingreso_compra, salida_produccion, ajuste_inventario, merma, devolucion
    }

    @PrePersist
    protected void onCreate() {
        fechaMovimiento = LocalDateTime.now();
    }
}
