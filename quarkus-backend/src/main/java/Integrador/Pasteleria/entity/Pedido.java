package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "Pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idOrder;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario user;

    @ManyToOne
    @JoinColumn(name = "id_direccion")
    private Direccion direccion;

    @ManyToOne
    @JoinColumn(name = "id_estado_actual", nullable = false)
    private EstadoPedido estadoActual;

    @Column(name = "numero_pedido", nullable = false, unique = true)
    private String numeroPedido;

    @Column(name = "fecha_pedido")
    private LocalDateTime orderDate;

    @Column(name = "fecha_entrega_estimada")
    private LocalDateTime fechaEntregaEstimada;

    @Column(name = "fecha_entrega_real")
    private LocalDateTime fechaEntregaReal;

    @Column(name = "subtotal")
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "descuento")
    private BigDecimal orderDiscount = BigDecimal.ZERO;

    @Column(name = "impuesto")
    private BigDecimal impuesto = BigDecimal.ZERO;

    @Column(name = "costo_envio")
    private BigDecimal costoEnvio = BigDecimal.ZERO;

    @Column(name = "total", nullable = false)
    private BigDecimal orderTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_entrega")
    private MetodoEntrega metodoEntrega = MetodoEntrega.delivery;

    @Column(name = "notas_cliente")
    private String notasCliente;

    @Column(name = "notas_internas")
    private String notasInternas;

    @Column(name = "dedicatoria")
    private String dedicatoria;

    @Column(name = "codigo_seguimiento", unique = true)
    private String codigoSeguimiento;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime updatedAt;

    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;

    public enum MetodoEntrega {
        delivery, recojo_tienda, programado
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (orderDate == null)
            orderDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
