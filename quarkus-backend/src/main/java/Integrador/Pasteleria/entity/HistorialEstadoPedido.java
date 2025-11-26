package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "HistorialEstadoPedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialEstadoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Integer idHistorial;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_estado", nullable = false)
    private EstadoPedido estado;

    @ManyToOne
    @JoinColumn(name = "id_usuario_cambio")
    private Usuario usuarioCambio;

    @Column(name = "fecha_cambio")
    private LocalDateTime fechaCambio;

    @Column(name = "comentario")
    private String comentario;

    @PrePersist
    protected void onCreate() {
        fechaCambio = LocalDateTime.now();
    }
}
