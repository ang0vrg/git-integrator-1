package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Venta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sale")
    private Integer idSale;

    @Column(name = "sale_type", nullable = false)
    private String saleType;

    @Column(name = "sale_status", nullable = false)
    private String saleStatus;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "sale_subtotal", nullable = false)
    private Double saleSubtotal;

    @ManyToOne
    @JoinColumn(name = "id_order", nullable = false)
    private Pedido order;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SaleType {
        EFECTIVO,
        TARJETA
    }

    public enum SaleStatus {
        PENDIENTE,
        CONFIRMADO,
        RECHAZADO
    }
}
