package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "Venta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Integer idSale;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido order;

    @ManyToOne
    @JoinColumn(name = "id_metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    @ManyToOne
    @JoinColumn(name = "id_usuario_registro")
    private Usuario usuarioRegistro;

    @Column(name = "numero_venta", nullable = false, unique = true)
    private String numeroVenta;

    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @Column(name = "monto_pagado")
    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Column(name = "monto_cambio")
    private BigDecimal montoCambio = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago")
    private EstadoPago estadoPago = EstadoPago.pendiente;

    @Column(name = "referencia_transaccion")
    private String referenciaTransaccion;

    @Column(name = "fecha_venta")
    private LocalDateTime saleDate;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime updatedAt;

    public enum EstadoPago {
        pendiente, pagado, parcial, rechazado, reembolsado
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (saleDate == null)
            saleDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
