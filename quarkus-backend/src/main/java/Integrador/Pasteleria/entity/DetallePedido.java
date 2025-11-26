package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "PedidoDetalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idOrderDetail;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido order;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto product;

    @Column(name = "cantidad", nullable = false)
    private Integer quantity;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal price;

    @Column(name = "subtotal", insertable = false, updatable = false)
    private BigDecimal subtotal;

    @Column(name = "personalizacion")
    private String personalizacion;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
